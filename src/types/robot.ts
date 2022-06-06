import { RobotOrigin } from "@prisma/client"

export interface IRobot {
    id?: string,

    name: string,
    origin: RobotOrigin,
    origin_code: string,

    created_at?: Date,

}