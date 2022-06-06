import { OPERATION_TYPE, Prisma } from "@prisma/client";
import { ILoggedUser } from "../types/auth";
import { IOperationAccount, IOperationAccountCreateRepository, OPERATION_ACCOUNT_FILTER } from "../types/operation-account";
import BaseRepository from "./base-repository";

class OperationAccountRepository extends BaseRepository {
    select_arguments = {
        id: true,

        name: true,
        balance: true,
        account_number: true,
        is_demo: true,
        operation_type: true,
        spread_type: true,
        leverage: true,
        main_password: true,
        robot_expires_at: true,
        is_robot_active: true,

        created_at: true,
        updated_at: true,

        user_role_id: true,
        robot_id: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.operationAccount);
    }

    public async create(
        user: ILoggedUser,
        operation_account: IOperationAccountCreateRepository
    ): Promise<IOperationAccount> {
        const ret = await this.client.create({
            data: {
                ...operation_account,
                user_role_id: user.user_role_id,
            },
            select: this.select_arguments,
        });

        return ret;
    }

    public async findById(id: string): Promise<IOperationAccount> {
        return await this.client.findUnique({
            where: {
                id,
            },
            select: this.select_arguments,
        });
    }

    public async listReals(user_role_id: string): Promise<any> {
        const ret = await this.client.findMany({
            where: {
                user_role_id,
                deleted_at: null,
                is_demo: false
            },
            select: this.select_arguments,
        });

        return ret;
    }

    public async listDemos(user_role_id: string): Promise<any> {
        const ret = await this.client.findMany({
            where: {
                user_role_id,
                deleted_at: null,
                is_demo: true
            },
            select: this.select_arguments,
        });

        return ret;
    }

    public async listByUser(
        user_role_id: string, 
        is_demo: boolean, 
        filter: OPERATION_ACCOUNT_FILTER = OPERATION_ACCOUNT_FILTER.ALL
    ): Promise<IOperationAccount[]> {
        let where: Prisma.OperationAccountWhereInput = {
            user_role_id,
            is_demo,
            deleted_at: null,
        };

        if (filter === OPERATION_ACCOUNT_FILTER.JUST_ACTIVE_ROBOT) {
            where.AND = ([{is_robot_active: true}]);
        } else if (filter === OPERATION_ACCOUNT_FILTER.WITHOUT_ACTIVE_ROBOT) {
            where.AND = ([{is_robot_active: null}]);//or false
        }

        const ret = await this.client.findMany({
            where,
            select: this.select_arguments
        });

        return ret;
    }

    public async listBotmoneyAccountsByUser(
        user_role_id: string, 
        is_demo: boolean, 
        filter: OPERATION_ACCOUNT_FILTER = OPERATION_ACCOUNT_FILTER.ALL
    ): Promise<IOperationAccount[]> {
        let where: Prisma.OperationAccountWhereInput = {
            user_role_id,
            is_demo,
            operation_type: OPERATION_TYPE.BOTMONEY,
            deleted_at: null,
        };

        if (filter === OPERATION_ACCOUNT_FILTER.JUST_ACTIVE_ROBOT) {
            where.AND = ([{is_robot_active: true}]);
        } else if (filter === OPERATION_ACCOUNT_FILTER.WITHOUT_ACTIVE_ROBOT) {
            where.AND = ([{is_robot_active: null}]);//or false
        }

        const ret = await this.client.findMany({
            where,
            select: this.select_arguments
        });

        return ret;
    }

    public async updateBalance(id: string, new_balance: number): Promise<IOperationAccount> {
        const ret = await this.client.update({
            where: {
                id,
            },
            data: {
                balance: new_balance,
            },
            select: this.select_arguments,
        });

        return ret;
    }

    public async startRobot(operation_account_id: string, robot_id: string, robot_expires_at: string): Promise<IOperationAccount> {
        const ret = await this.client.update({
            where: { id: operation_account_id },
            data: {
                robot_id,
                robot_expires_at,
                is_robot_active: true
            },
            select: this.select_arguments
        });

        return ret;
    }

    public async stopRobot(operation_account_id: string) {
        await this.client.update({
            where: { id: operation_account_id },
            data: {
                is_robot_active: false,
                robot_id: null
            }
        });
    }
}

export default OperationAccountRepository;
