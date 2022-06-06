import NotFoundError from "../../errors/not-found-error";
import { l } from "../../helpers/general";
import { IWallet } from "../../types/wallet";
import BaseRepository from "../base-repository";

class WalletRepository extends BaseRepository {
    protected select_arguments = {
        id: true,
        address: true,
        private_key: true,
        balance: true,
        user_role_id: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.wallet);
    }

    public async getBalance(wallet_id: string): Promise<number> {
        const wallet = await this.client.findFirst({
            where: {
                id: wallet_id,
            },
            select: {
                balance: true,
            },
        });

        if (!wallet) throw new NotFoundError("wallet.not_found");

        return wallet.balance;
    }

    public async getWalletByUserRole(user_role_id: string): Promise<IWallet> {
        return await this.client.findFirst({
            where: {
                user_role_id,
            },
            select: this.select_arguments,
        });
    }

    public async findById(wallet_id: string): Promise<IWallet> {
        return await this.client.findFirst({
            where: {
                id: wallet_id,
            },
            select: this.select_arguments,
        });
    }

    public async create(data: Partial<IWallet>): Promise<IWallet> {
        return await this.client.create({
            data: data,
            select: this.select_arguments,
        });
    }

    public async saveWalledAddress(wallet_id: string, address: string): Promise<IWallet> {
        return await this.client.update({
            where: {
                id: wallet_id,
            },
            data: {
                address,
            },
            select: this.select_arguments,
        });
    }
}

export default WalletRepository;
