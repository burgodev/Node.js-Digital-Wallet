import AXService from "../../services/common/ax.service";
import WalletRepository from "../../repositories/client/wallet-repository";
import { IWallet } from "../../types/wallet";
import { l } from "../../helpers/general";
import ValidationError from "../../errors/validation-error";
import TransactionRequestRepository from "../../repositories/client/transaction-request-repository";
import { TransactionEntityType } from "../../types/transaction";

class WalletService {
    private repository: WalletRepository;

    constructor() {
        this.repository = new WalletRepository();
    }

    public async create(data: Partial<IWallet>): Promise<IWallet> {
        return await this.repository.create(data);
    }

    public async getBalance(user_role_id: string): Promise<{ balance: number; blocked_balance: number }> {
        const wallet = await this.repository.getWalletByUserRole(user_role_id);

        if (!wallet) return {
            balance: 0,
            blocked_balance: 0,
        };

        const balance = await this.getBalanceByUserRole(null, wallet);
        const blocked_balance = await this.getBlockedBalance(wallet.id);
        return {
            balance,
            blocked_balance,
        };
    }

    public async getBalanceByUserRole(user_role_id: string, wallet: IWallet = null): Promise<number> {
        if (wallet == null) wallet = await this.getWalletByUserRole(user_role_id);
        if (!wallet || !wallet.address) return 0;
        return wallet.balance;
    }

    public async getBlockedBalance(wallet_id: string): Promise<number> {
        const transaction_request_repository = new TransactionRequestRepository();
        return await transaction_request_repository.getBlockedBalance(TransactionEntityType.WALLET, wallet_id);
    }

    public async getAddress(user_role_id: string): Promise<string> {
        const wallet = await this.getWalletByUserRole(user_role_id);

        if (wallet.address != null) return wallet.address;

        const wallet_with_address = await this.createAXWallet(wallet);
        return wallet_with_address.address;
    }

    private async createAXWallet(wallet: IWallet): Promise<IWallet> {
        if (wallet.address != null) {
            l.warn("Trying to create a wallet that's already exists in AXBank");
            return wallet;
        }

        const ax_service = new AXService();
        const hash = await ax_service.generateWallet(wallet.id);

        return await this.repository.saveWalledAddress(wallet.id, hash);
    }

    private async getWalletByUserRole(user_role_id: string): Promise<IWallet> {
        const wallet = await this.repository.getWalletByUserRole(user_role_id);
        if (!wallet) throw new ValidationError("ax.wallet.not_found");
        return wallet;
    }
}

export default WalletService;
