import { REQUEST_STATUS, REQUEST_TYPE } from "@prisma/client"

export interface IRobotOperationRequest {
    id?: string,

    request_type: REQUEST_TYPE,
    status?: REQUEST_STATUS,
    executed_at?: Date,
    requested_at?: Date

    operation_account_id: string,
    robot_id: string
}