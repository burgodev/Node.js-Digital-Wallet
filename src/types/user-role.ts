import { UserRoleStatus } from "@prisma/client";

export interface IUserRole {
    id?: string;
    user_id: string;
    role_id: string;
    password?: string;
    status?: UserRoleStatus | string;
    integration_token?:string;
    manager_id?:string;
    manager_code?:string
    metatrader_client_id?: number;
    integrated_account_id?: string;
}
