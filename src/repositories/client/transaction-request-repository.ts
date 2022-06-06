import { Prisma, TransactionRequestStatus } from "@prisma/client";
import APIError from "../../errors/api-error";
import { Paginate } from "../../types/common";
import { TransactionEntityType } from "../../types/transaction";
import { TransactionRequest } from "../../types/transaction-request";
import { TransactionTypeOptions } from "../../types/transaction-type";
import BaseRepository from "../base-repository";
import TransactionTypeRepository from "./transaction-type-repository";

class TransactionRequestRepository extends BaseRepository {
    protected select_arguments = {
        id: true,
        source: true,
        target: true,
        type_id: true,
        amount: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.transactionRequest);
    }

    public async list(user_role_id: string): Promise<TransactionRequest[]> {
        return await this.client.findMany({
            where: {
                user_role_id,
                status: TransactionRequestStatus.WAITING,
            },
            select: this.select_arguments,
        });
    }

    public async listLinked(user_role_id: string, take: number, skip: number, types: string[], linked_to: string = null): Promise<Paginate<TransactionRequest>> {
        let where: Prisma.TransactionRequestWhereInput = {
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

    public async getBlockedBalance(entity: TransactionEntityType, entity_id: string): Promise<number> {
        let type = null;
        switch (entity) {
            case TransactionEntityType.WALLET:
                type = await new TransactionTypeRepository().getByName(TransactionTypeOptions.RESCUE);
                break;
            case TransactionEntityType.OPERATION_ACCOUNT:
                type = await new TransactionTypeRepository().getByName(TransactionTypeOptions.APPLICATION);
                break;
        }
        if (type == null) throw new APIError();

        const requests = await this.client.aggregate({
            where: {
                status: TransactionRequestStatus.WAITING,
                target: entity_id,
                type_id: type.id,
            },
            _sum: {
                amount: true,
            },
        });

        return requests ? requests._sum : 0;
    }
}

export default TransactionRequestRepository;
