import { OPERATION_TYPE, REQUEST_STATUS, REQUEST_TYPE } from "@prisma/client";
import APIError from "../../errors/api-error";
import ValidationError from "../../errors/validation-error";
import { l } from "../../helpers/logs";
import OperationAccountRepository from "../../repositories/operation-account-repository";
import RobotOperationRequestRepository from "../../repositories/robot-operation-request-repository";
import RobotRepository from "../../repositories/robot-repository";
import { IRobotOperationRequest } from "../../types/robot-operation-request";

class RobotService {

    private operationAccountRepository: OperationAccountRepository;
    private robotOperationRequestRepository: RobotOperationRequestRepository;

    constructor() {
        this.operationAccountRepository = new OperationAccountRepository();
        this.robotOperationRequestRepository = new RobotOperationRequestRepository();
    }

    public async startRobotRequest(operation_account_id: string, origin_robot_id: string, robot_expires_at: string) {
        const operation_account = await this.operationAccountRepository.findById(operation_account_id);
        
        if (!operation_account) {
            throw new ValidationError("operation_account.not_found");
        }

        if (operation_account.operation_type != OPERATION_TYPE.BOTMONEY) {
            throw new ValidationError("robot.operation_account_invalid_operation_type");
        }

        if (await this.isTherePendingRequest(operation_account_id)) {
            throw new ValidationError("robot.there_is_already_other_request_waiting");
        }

        if (operation_account.is_robot_active) {
            throw new ValidationError("robot.operation_account_already_in_use");
        }

        const robot = await new RobotRepository().findByOriginCode(origin_robot_id);

        if (!robot) {
            throw new ValidationError("robot.could_not_find_robot");
        }

        if (operation_account.balance > 0) {
            
            const ror: IRobotOperationRequest = {
                operation_account_id,
                robot_id: robot.id,
                request_type: REQUEST_TYPE.START,
                status: REQUEST_STATUS.WAITING
            }

            await this.robotOperationRequestRepository.create(ror);

        } else {
            await this.operationAccountRepository.startRobot(operation_account_id, robot.id, robot_expires_at);
        }

    }

    public async stopRobotRequest(operation_account_id: string) {
        const operation_account = await this.operationAccountRepository.findById(operation_account_id);
        
        if (!operation_account) {
            throw new ValidationError("operation_account.not_found");
        }

        if (operation_account.operation_type != OPERATION_TYPE.BOTMONEY) {
            throw new ValidationError("robot.operation_account_invalid_operation_type");
        }

        if (await this.isTherePendingRequest(operation_account_id)) {
            throw new ValidationError("robot.there_is_already_other_request_waiting");
        }

        if (!operation_account.is_robot_active) {
            throw new ValidationError("robot.already_stopped");
        }

        if (!operation_account.robot_id) {
            l.fatal("robot.active_robot_but_missing_robot_id");
            throw new APIError();
        }

        if (operation_account.balance === 0) {
            
            await this.operationAccountRepository.stopRobot(operation_account_id);

        } else {

            const ror: IRobotOperationRequest = {
                operation_account_id,
                robot_id: operation_account.robot_id,
                request_type: REQUEST_TYPE.STOP,
                status: REQUEST_STATUS.WAITING
            }

            await this.robotOperationRequestRepository.create(ror);
        }
    }

    private async isTherePendingRequest(operation_account_id: string): Promise<boolean> {
        const requests = await this.robotOperationRequestRepository.listWaitingOperationRequestByOperationAccountId(operation_account_id);
        
        if (requests.length > 0) {
            return true;
        }

        return false;
    }

}

export default RobotService;

