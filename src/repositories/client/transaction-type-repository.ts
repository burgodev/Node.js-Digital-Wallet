import { ITransactionType, TransactionTypeOptions } from "../../types/transaction-type";
import BaseRepository from "../base-repository";

class TransactionTypeRepository extends BaseRepository {
    protected select_arguments = {
        id: true,
        name: true,
        from: true,
        to: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.transactionType);
    }

    public async getById(id: string): Promise<ITransactionType> {
        return this.client.findUnique({
            where: {
                id,
            },
            select: this.select_arguments,
        });
    }

    public async getByName(name: string): Promise<ITransactionType> {
        return this.client.findFirst({
            where: {
                name,
            },
            select: this.select_arguments,
        });
    }

    public async getListByNames(names: string[]): Promise<ITransactionType[]> {
        return this.client.findMany({
            where: {
                name: { in: names },
            },
            select: this.select_arguments,
        });
    }

    public async getIDsLinkedToOperationAccount(): Promise<string[]> {
        const types = await this.getListByNames([
            TransactionTypeOptions.APPLICATION,
            TransactionTypeOptions.RESCUE,
            TransactionTypeOptions.TRANSFER,
        ]);

        return types.map(t => t.id);
    }

    public async getIDsLinkedToWallet(): Promise<string[]> {
        const types = await this.getListByNames([
            TransactionTypeOptions.APPLICATION,
            TransactionTypeOptions.RESCUE,
            TransactionTypeOptions.DEPOSIT,
            TransactionTypeOptions.WITHDRAW,
        ]);

        return types.map(t => t.id);
    }
}

export default TransactionTypeRepository;
