import { l } from "../../helpers/general";
import { Paginate } from "../../types/common";
import {  TransactionRequestAdmin } from "../../types/transaction-request";
import BaseRepository from "../base-repository";

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

    public async list(take: number, skip: number): Promise<Paginate<TransactionRequestAdmin>> {
        const [ list, count ] = await this.prisma.$transaction([
            (
                this.prisma.$queryRaw`
                    SELECT 
                        tr.id,
                        tr.created_at AS requested_at,
                        (CASE tt."name" 
                            WHEN 'application' THEN 'transaction.application'
                            WHEN 'rescue' THEN 'transaction.rescue'
                        END) AS transaction_type,
                        (u.first_name || ' ' || u.last_name) AS user_name,
                        oa.account_number AS login_mt5,
                        'Active' AS signature_status,
                    -- 	r.name AS robot_name,
                        tr.amount
                    FROM 
                        transaction_requests tr
                    INNER JOIN transaction_types tt ON tt.id = tr.type_id
                    INNER JOIN operation_accounts oa ON (
                        (oa.id = tr."target"::uuid AND tt."to" = 'OPERATION_ACCOUNT') 
                        OR 
                        (oa.id = tr."source"::uuid AND tt."from" = 'OPERATION_ACCOUNT')
                    )
                    -- INNER JOIN robots r ON r.id = oa.robot_id
                    INNER JOIN user_roles ur ON ur.id = oa.user_role_id
                    INNER JOIN users u ON u.id = ur.user_id
                    WHERE 
                        tr.status = 'WAITING'
                        AND (tt."name" = 'application' OR tt."name" = 'rescue')
                    LIMIT ${take}
                    OFFSET ${skip}
                ;`
            ),
            (
                this.prisma.$queryRaw`
                    SELECT 
                        count(tr.id) as qtd
                    FROM 
                        transaction_requests tr
                    INNER JOIN transaction_types tt ON tt.id = tr.type_id
                    INNER JOIN operation_accounts oa ON (
                        (oa.id = tr."target"::uuid AND tt."to" = 'OPERATION_ACCOUNT') 
                        OR 
                        (oa.id = tr."source"::uuid AND tt."from" = 'OPERATION_ACCOUNT')
                    )
                    -- INNER JOIN robots r ON r.id = oa.robot_id
                    INNER JOIN user_roles ur ON ur.id = oa.user_role_id
                    INNER JOIN users u ON u.id = ur.user_id
                    WHERE 
                        tr.status = 'WAITING'
                        AND (tt."name" = 'application' OR tt."name" = 'rescue')
                ;`
            ),
        ]);

        const pages = Math.ceil(count[0]?.qtd / take);

        return {
            list,
            pages,
        };
    }
}

export default TransactionRequestRepository;
