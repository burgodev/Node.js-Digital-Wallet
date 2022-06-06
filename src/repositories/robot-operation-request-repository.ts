import { REQUEST_STATUS, REQUEST_TYPE } from "@prisma/client";
import { IRobotOperationRequest } from "../types/robot-operation-request";
import BaseRepository from "./base-repository";

class RobotOperationRequestRepository extends BaseRepository {
    
    protected select_arguments = {
        id: true,
    
        request_type: true,
        status: true,
        executed_at: true,
        requested_at: true,
    
        operation_account_id: true,
        robot_id: true
    }

    constructor() {
        super();
        this.setClient(this.prisma.RobotOperationRequest);
    }

    public async create(ror: IRobotOperationRequest): Promise<IRobotOperationRequest> {
        const ret = await this.client.create({
            data: ror,
            select: this.select_arguments
        });

        return ret;
    }

    public async listWaitingOperationRequestByOperationAccountId(operation_account_id: string): Promise<IRobotOperationRequest[]> {
        const ret = await this.client.findMany({
            where: {
                operation_account_id,
                status: REQUEST_STATUS.WAITING
            },
            select: this.select_arguments
        });

        return ret;
    }

}

export default RobotOperationRequestRepository;