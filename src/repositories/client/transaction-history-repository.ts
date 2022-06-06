import { Prisma } from "@prisma/client";
import BaseRepository from "../base-repository";
import { TransactionHistory } from "../../types/transaction-history";
import { Paginate } from "../../types/common";

class TransactionHistoryRepository extends BaseRepository<TransactionHistory> {
    protected select_arguments = {
        id: true,
        source: true,
        target: true,
        type_id: true,
        amount: true,
        external_reference: true,
        processed_at: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.transactionHistory);
    }

    public async findByExternalReference(external_reference: string): Promise<TransactionHistory> {
        return await this.client.findFirst({
            where: {
                external_reference,
            },
            select: this.select_arguments,
        });
    }

    public async list(user_role_id: string, type_id: string = null): Promise<TransactionHistory[]> {
        let where: Prisma.TransactionHistoryWhereInput = {
            user_role_id,
        };

        if (type_id != null) {
            where = { ...where, type_id };
        }

        return await this.client.findMany({
            where,
            select: this.select_arguments,
        });
    }

    public async listLinked(user_role_id: string, take: number, skip: number, types: string[], linked_to: string = null): Promise<Paginate<TransactionHistory>> {
        let where: Prisma.TransactionHistoryWhereInput = {
            user_role_id,
            type_id: { in: types },
        };

        if (linked_to !== null) {
            where.AND = [
                {
                    OR: [
                        { source: linked_to },
                        { target: linked_to },
                    ]
                }
            ];
        }

        const history = await this.paginate({
            where,
            select: this.select_arguments,
        }, take, skip);

        return history;
    }
}

export default TransactionHistoryRepository;
