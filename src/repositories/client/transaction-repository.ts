import { TransactionEntity, TransactionRequestStatus } from "@prisma/client";
import APIError from "../../errors/api-error";
import ValidationError from "../../errors/validation-error";
import { formatDateToDB, l } from "../../helpers/general";
import { IOperationAccount } from "../../types/operation-account";
import { TransactionHistory, TransactionHistoryCreateDTO } from "../../types/transaction-history";
import { TransactionRequest, TransactionRequestCreateDTO } from "../../types/transaction-request";
import { TransactionTypeOptions } from "../../types/transaction-type";
import { IWallet } from "../../types/wallet";
import BaseRepository from "../base-repository";
import TransactionTypeRepository from "./transaction-type-repository";
import t_schema from "../../i18n/mock";
import AXService, { withdraw_wallet_address } from "../../services/common/ax.service";

interface IAXDeposit {
    idSolicitacao: string;
    hash: string;
    hashOrigem: string;
    hashDestino: string;
    wallet: string;
    valor: number;
    codigoIntegracao: string;
}

class TransactionRepository extends BaseRepository {
    protected history_select_arguments = {
        id: true,
        source: true,
        target: true,
        type_id: true,
        amount: true,
        user_role_id: true,
        external_reference: true,
        processed_at: true,
    };

    protected request_select_arguments = {
        id: true,
        source: true,
        target: true,
        type_id: true,
        amount: true,
        status: true,
        external_reference: true,
        user_role_id: true,
        processed_at: true,
    };

    protected wallet_select_arguments = {
        id: true,
        address: true,
        private_key: true,
        balance: true,
        user_role_id: true,
    };

    protected operation_account_select_arguments = {
        id: true,

        name: true,
        balance: true,
        account_number: true,
        is_demo: true,
        operation_type: true,
        spread_type: true,
        leverage: true,

        created_at: true,
        updated_at: true,

        user_role_id: true,
        robot_id: true,
    };

    constructor() {
        super();
    }

    /**
     * This function is called by AXBank api when a deposit is confirmed
     * AX account -> Wallet
     */
    public async deposit(data: IAXDeposit, wallet: IWallet, amount: number): Promise<TransactionHistory> {
        const transaction_type = await new TransactionTypeRepository().getByName(TransactionTypeOptions.DEPOSIT);

        return this.prisma.$transaction(async (client) => {
            this.client = client;

            const history = await this.createHistory({
                type_id: transaction_type.id,
                source: data.hashOrigem,
                target: wallet.id,
                external_reference: data.idSolicitacao,
                amount,
                user_role_id: wallet.user_role_id,
            });

            if (!history) throw new APIError();

            wallet = await this.incrementWalletBalance(wallet.id, amount);

            return history;
        });
    }

    /**
     * This function requests a withdraw to AXBank api
     * Wallet -> AX account
     */
    public async withdraw(user_role_id: string, wallet_id: string, amount: number, address: string): Promise<TransactionRequest> {
        const ax_service = new AXService();
        const transaction_type = await new TransactionTypeRepository().getByName(TransactionTypeOptions.WITHDRAW);

        return this.prisma.$transaction(async (client): Promise<TransactionRequest> => {
            this.client = client;

            const wallet = await this.decrementWalletBalance(wallet_id, amount);
            const request = await this.createRequest({
                type_id: transaction_type.id,
                source: wallet.id,
                target: address,
                amount,
                user_role_id,
            });
            
            const external_reference = await ax_service.withdraw(address, amount);
            await this.updateRequest(request.id, { external_reference });

            return request;        
        });
    }

    /**
     * This function move balance from wallet to a operation account
     * Wallet -> OA
     */
    public async application(
        user_role_id: string,
        wallet_id: string,
        operation_account_id: string,
        amount: number
    ): Promise<TransactionHistory> {
        const transaction_type = await new TransactionTypeRepository().getByName(TransactionTypeOptions.APPLICATION);

        return this.prisma.$transaction(async (client): Promise<TransactionHistory> => {
            this.client = client;

            const wallet = await this.decrementWalletBalance(wallet_id, amount);

            const operation_account = await this.incrementOperationAccountBalance(operation_account_id, amount);

            const history = await this.createHistory({
                user_role_id,
                amount,
                source: wallet.id,
                target: operation_account.id,
                type_id: transaction_type.id,
            });

            if (!history) {
                throw new APIError(t_schema.transaction.application.error);
            }

            return history;
        });
    }

    public async requestApplication(
        user_role_id: string,
        wallet_id: string,
        operation_account_id: string,
        amount: number
    ): Promise<TransactionRequest> {
        const transaction_type = await new TransactionTypeRepository().getByName(TransactionTypeOptions.APPLICATION);

        return this.prisma.$transaction(async (client): Promise<TransactionRequest> => {
            this.client = client;

            await this.decrementWalletBalance(wallet_id, amount);

            const request = await this.createRequest({
                amount,
                user_role_id,
                source: wallet_id,
                target: operation_account_id,
                type_id: transaction_type.id,
            });

            return request;
        });
    }

    /**
     * This function move balance from a operation account to wallet
     * OA -> Wallet
     */
    public async rescue(
        user_role_id: string,
        wallet_id: string,
        operation_account_id: string,
        amount: number
    ): Promise<TransactionHistory> {
        const transaction_type = await new TransactionTypeRepository().getByName(TransactionTypeOptions.RESCUE);

        return this.prisma.$transaction(async (client): Promise<TransactionHistory> => {
            this.client = client;

            await this.decrementOperationAccountBalance(operation_account_id, amount);
            await this.incrementWalletBalance(wallet_id, amount);

            const history = await this.createHistory({
                amount,
                user_role_id,
                source: operation_account_id,
                target: wallet_id,
                type_id: transaction_type.id,
            });

            return history;
        });
    }

    public async requestRescue(
        user_role_id: string,
        wallet_id: string,
        operation_account_id: string,
        amount: number
    ): Promise<TransactionRequest> {
        const transaction_type = await new TransactionTypeRepository().getByName(TransactionTypeOptions.RESCUE);

        return this.prisma.$transaction(async (client): Promise<TransactionRequest> => {
            this.client = client;

            await this.decrementOperationAccountBalance(operation_account_id, amount);

            const request = await this.createRequest({
                amount,
                user_role_id,
                source: operation_account_id,
                target: wallet_id,
                type_id: transaction_type.id,
            });

            return request;
        });
    }

    // TODO
    /**
     * This function move balance from one operation account to another
     * OA -> OA
     */
    public async transfer(): Promise<void> {}

    public async completeRequest(request_id: string): Promise<TransactionHistory> {
        return this.prisma.$transaction(async (client): Promise<TransactionHistory> => {
            this.client = client;

            const { id, amount, source, target, type_id, user_role_id, external_reference, processed_at } = await this.getRequest(request_id);
            const transaction_type = await new TransactionTypeRepository().getById(type_id);

            if (processed_at != null) throw new ValidationError("transaction.request.already_proccessed");

            await this.moveBalance(transaction_type.to, target, amount);

            const history = await this.createHistory({
                amount,
                source,
                target,
                type_id,
                user_role_id,
                external_reference,
            });

            const request = await this.processRequest(id, TransactionRequestStatus.APPROVED);

            return history;
        });
    }

    public async cancelRequest(request_id: string, reason: string): Promise<TransactionRequest> {   
        return this.prisma.$transaction(async (client): Promise<TransactionRequest> => {
            this.client = client;

            const { id, amount, source, target, type_id, user_role_id, processed_at } = await this.getRequest(request_id);
            
            if (processed_at != null) throw new ValidationError("transaction.request.already_proccessed");

            const transaction_type = await new TransactionTypeRepository().getById(type_id);

            await this.moveBalance(transaction_type.from, source, amount);
            
            const request = await this.processRequest(id, TransactionRequestStatus.REFUSED, reason);
            return request;
        });
    }

    private async createHistory(data: TransactionHistoryCreateDTO): Promise<TransactionHistory> {
        return await this.client.transactionHistory.create({
            data,
            select: this.history_select_arguments,
        });
    }

    private async updateHistory(transaction_history_id: string, data: Partial<TransactionHistory>): Promise<TransactionHistory> {
        return await this.client.transactionHistory.create({
            where: {
                id: transaction_history_id,
            },
            data,
            select: this.history_select_arguments,
        });
    }

    private async createRequest(data: TransactionRequestCreateDTO): Promise<TransactionRequest> {
        return await this.client.transactionRequest.create({
            data,
            select: this.request_select_arguments,
        });
    }

    private async updateRequest(transaction_request_id: string, data: Partial<TransactionRequest>): Promise<TransactionRequest> {
        return await this.client.transactionRequest.update({
            where: {
                id: transaction_request_id,
            },
            data,
            select: this.request_select_arguments,
        });
    }

    private async getRequest(request_id: string): Promise<TransactionRequest> {
        return await this.client.transactionRequest.findUnique({
            where: {
                id: request_id,
            },
            select: this.request_select_arguments,
        });
    }

    private async moveBalance(to: string, id: string, amount: number): Promise<void> {
        if (to == TransactionEntity.WALLET) {
            await this.incrementWalletBalance(id, amount);
        } else if (to == TransactionEntity.OPERATION_ACCOUNT) {
            await this.incrementOperationAccountBalance(id, amount);
        }
    }

    public async processRequest(request_id: string, status: TransactionRequestStatus, reason: string = null): Promise<TransactionRequest> {
        const request = await this.client.transactionRequest.update({
            where: {
                id: request_id,
            },
            data: {
                status,
                processed_at: formatDateToDB(new Date()),
                reason,
            },
            select: this.request_select_arguments,
        });

        return request;
    }

    /**
     * Imcrements amount into balance value of the wallet
     * @param wallet_id
     * @param amount
     * @returns wallet
     */
    private async incrementWalletBalance(wallet_id: string, amount: number): Promise<IWallet> {
        return await this.client.wallet.update({
            where: {
                id: wallet_id,
            },
            data: {
                balance: {
                    increment: amount,
                },
            },
            select: this.wallet_select_arguments,
        });
    }

    /**
     * Imcrements amount into balance value of the wallet
     * @param wallet_id
     * @param amount
     * @returns wallet
     */
    private async decrementWalletBalance(wallet_id: string, amount: number): Promise<IWallet> {
        const wallet = await this.client.wallet.update({
            where: {
                id: wallet_id,
            },
            data: {
                balance: {
                    decrement: amount,
                },
            },
            select: this.wallet_select_arguments,
        });

        if (wallet.balance < 0) throw new ValidationError(t_schema.wallet.balance.insufficient);

        return wallet;
    }

    private async incrementOperationAccountBalance(id: string, amount: number): Promise<IOperationAccount> {
        const operation_account = await this.client.operationAccount.update({
            where: {
                id,
            },
            data: {
                balance: {
                    increment: amount,
                },
            },
            select: this.operation_account_select_arguments,
        });

        return operation_account;
    }

    private async decrementOperationAccountBalance(id: string, amount: number): Promise<IOperationAccount> {
        const operation_account = await this.client.operationAccount.update({
            where: {
                id,
            },
            data: {
                balance: {
                    decrement: amount,
                },
            },
            select: this.operation_account_select_arguments,
        });

        if (operation_account.balance < 0) throw new ValidationError(t_schema.operation_account.balance.insufficient);

        return operation_account;
    }

    public async getRequestByExternalReference(external_reference: string): Promise<TransactionRequest> {
        return await this.prisma.transactionRequest.findFirst({
            where: {
                external_reference,
            },
            select: this.request_select_arguments,
        });
    }
}

export default TransactionRepository;
