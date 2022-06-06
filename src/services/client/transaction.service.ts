import { ITransactionType } from "../../types/transaction-type";
import { IOperationAccount } from "../../types/operation-account";
import { Source, Target, Transaction, TransactionEntity, TransactionEntityType } from "../../types/transaction";
import ValidationError from "../../errors/validation-error";
import WalletRepository from "../../repositories/client/wallet-repository";
import OperationAccountRepository from "../../repositories/operation-account-repository";
import { OPERATION_TYPE } from "@prisma/client";
import { IWallet } from "../../types/wallet";
import { TransactionHistory } from "../../types/transaction-history";
import TransactionRepository from "../../repositories/client/transaction-repository";
import TransactionHistoryService from "./transaction-history.service";
import t_schema from "../../i18n/mock";
import { t } from "../../helpers/general";
import IO from "../../helpers/io";
import NotificationService from "../common/notification.service";
import { TransactionRequest } from "../../types/transaction-request";

interface IAXDeposit {
    idSolicitacao: string;
    hash: string;
    hashOrigem: string;
    hashDestino: string;
    wallet: string;
    valor: number;
    codigoIntegracao: string;
}

class TransactionService {
    private transaction_repository: TransactionRepository;
    private wallet_repository: WalletRepository;
    private operation_account_repository: OperationAccountRepository;

    constructor() {
        this.transaction_repository = new TransactionRepository();
        this.wallet_repository = new WalletRepository();
        this.operation_account_repository = new OperationAccountRepository();
    }

    public async getTransactionOptions(
        user_role_id: string
    ): Promise<{ id: string; name: string; type: TransactionEntityType }[]> {
        const wallet = await this.wallet_repository.getWalletByUserRole(user_role_id);
        const operation_accounts = await this.operation_account_repository.listByUser(user_role_id, false);

        const transaction_options = [
            { id: wallet.id, name: t(t_schema.wallet.name), type: TransactionEntityType.WALLET },
            ...operation_accounts.map((oa) => ({
                id: oa.id,
                name: oa.name,
                type: TransactionEntityType.OPERATION_ACCOUNT,
            })),
        ];
        return transaction_options;
    }

    public async getSource(type: ITransactionType, source: string): Promise<Source> {
        return await this.getEntity(type.from, source);
    }

    public async getTarget(type: ITransactionType, target: string): Promise<Target> {
        return await this.getEntity(type.to, target);
    }

    private async getEntity(entity: string, entity_id: string): Promise<TransactionEntity> {
        switch (entity) {
            case "WALLET":
                return await new WalletRepository().findById(entity_id);
            case "OPERATION_ACCOUNT":
                return await new OperationAccountRepository().findById(entity_id);
            case "BINANCE_SMART_CHAIN":
                return entity_id;
            default:
                throw new ValidationError("");
        }
    }

    private async getWallet(user_role_id: string, wallet_id: string = null): Promise<IWallet> {
        let wallet = null;

        if (wallet_id) {
            wallet = await this.wallet_repository.findById(wallet_id);
        } else {
            wallet = await this.wallet_repository.getWalletByUserRole(user_role_id);
        }

        if (!wallet) throw new ValidationError(t_schema.wallet.not_found);
        return wallet;
    }

    private async getOperationAccount(operation_account_id: string): Promise<IOperationAccount> {
        const operation_account = await this.operation_account_repository.findById(operation_account_id);

        if (!operation_account) throw new ValidationError(t_schema.operation_account.not_found);
        return operation_account;
    }

    private async sendUpdateWalletBalance(user_role_id: string, wallet_id: string): Promise<void> {
        const wallet = await this.getWallet(user_role_id);
        await IO.walletBalanceChanged(user_role_id, wallet.balance);        
    }

    /**
     * This function is called by AXBank api when a deposit is confirmed
     * @param data: IAXDeposit
     * @returns wallet
     */
    public async deposit(data: IAXDeposit): Promise<TransactionHistory> {
        let wallet = await this.getWallet(null, data.codigoIntegracao);
        if (wallet.address == null) throw new ValidationError(t_schema.ax.wallet.address_not_found);

        const amount = data.valor || 0;
        if (amount <= 0) throw new ValidationError(t_schema.ax.deposit.amount_invalid);

        const transaction_history_service = new TransactionHistoryService();
        const transaction_validate = await transaction_history_service.validate(data.hash);
        if (!transaction_validate) throw new ValidationError(t_schema.ax.deposit.already_exists);

        const history = await this.transaction_repository.deposit(data, wallet, data.valor);

        await NotificationService.create(history.user_role_id, t_schema.transaction.deposit.created);

        await this.sendUpdateWalletBalance(history.user_role_id, wallet.id);
        return history;
    }

    public async withdraw(user_role_id: string, amount: number, address: string): Promise<TransactionRequest> {
        const wallet = await this.getWallet(user_role_id);
        if (wallet.balance < amount) throw new ValidationError(t_schema.wallet.balance.insufficient);
        
        const request = await this.transaction_repository.withdraw(user_role_id, wallet.id, amount, address);
        return request;
    }

    public async completeWithdraw(external_reference: string): Promise<TransactionHistory> {
        const request = await this.transaction_repository.getRequestByExternalReference(external_reference);
        const history = await this.transaction_repository.completeRequest(request.id);
        return history;
    }

    public async application(user_role_id: string, operation_account_id: string, amount: number): Promise<Transaction> {
        const operation_account = await this.getOperationAccount(operation_account_id);
        const wallet = await this.getWallet(user_role_id);

        if (operation_account.is_demo)
            throw new ValidationError(t_schema.transaction.application.operation_account.is_demo);
        if (wallet.balance < amount) throw new ValidationError(t_schema.wallet.balance.insufficient);

        if (operation_account.operation_type == OPERATION_TYPE.BOTMONEY && operation_account.is_robot_active) {
            const request = await this.transaction_repository.requestApplication(
                user_role_id,
                wallet.id,
                operation_account_id,
                amount
            );

            await this.sendUpdateWalletBalance(user_role_id, wallet.id);

            return request;
        }

        const history = await this.transaction_repository.application(
            user_role_id,
            wallet.id,
            operation_account_id,
            amount,
        );

        await this.sendUpdateWalletBalance(history.user_role_id, wallet.id);
        return history;
    }

    public async rescue(user_role_id: string, operation_account_id: string, amount: number): Promise<Transaction> {
        const operation_account = await this.getOperationAccount(operation_account_id);
        const wallet = await this.getWallet(user_role_id);

        if (operation_account.operation_type == OPERATION_TYPE.BOTMONEY && operation_account.is_robot_active) {
            
            const request = await this.transaction_repository.requestRescue(
                user_role_id,
                wallet.id,
                operation_account_id,
                amount
            );

            return request;
        }

        const history = await this.transaction_repository.rescue(user_role_id, wallet.id, operation_account_id, amount);

        await this.sendUpdateWalletBalance(history.user_role_id, wallet.id);

        return history;
    }
}

export default TransactionService;
