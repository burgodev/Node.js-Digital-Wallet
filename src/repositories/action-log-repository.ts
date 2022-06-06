import BaseRepository from "./base-repository";
import { ActionType } from "@prisma/client";
import { IActionLog } from "../types/action-log";
import { formatDateToDB } from "../helpers/general";
import { networkInterfaces } from "os";

class ActionLogRepository extends BaseRepository {
    protected select_arguments = {
        id: true,

        ip: true,
        datetime: true,
        action: true,

        user_role_id: true
    };

    constructor() {
        super();
        this.setClient(this.prisma.actionLog);
    }

    public async create(user_role_id: string, action: ActionType, ip: string = null, device_id = null): Promise<IActionLog> {
        return await this.client.create({
            data: {
                user_role_id,
                action,
                ip,
                datetime: formatDateToDB(new Date()),
                device_id,
            },
            select: this.select_arguments,
        });
    }

    public async getByUserRole(user_role_id: string, action: ActionType = null): Promise<IActionLog[]> {
        let where = { user_role_id };

        if (action != null) {
            where["action"] = action;
        }

        return await this.client.findMany({
            where,
            select: this.select_arguments,
        });
    }

}

export default ActionLogRepository;
