import { ActionType } from "@prisma/client";

export interface IActionLog {
    id: string;
    user_id: string;
    registered_at?: Date;
    type: ActionType;
}

export interface ILogInfosRequest {
    ip?: string,
    device_type?: string,
    mac_address?: string
}
