import UserRoleService from "../services/user-role.service";
import OperationAccountService from "../services/operation-account.service";
import { Request, Response } from "express";
import { r } from "../helpers/general";
import ValidationError from "../errors/validation-error";
import OperationAccountRepository from "../repositories/operation-account-repository";
import { ILoggedUser } from "../types/auth";
import RobotService from "../services/robot/robot-service";

class BotmoneyController {

    private userRoleService: UserRoleService;
    private operationAccountService: OperationAccountService
    private robotService: RobotService;

    constructor() {
        this.userRoleService = new UserRoleService();
        this.operationAccountService = new OperationAccountService(new OperationAccountRepository());
        this.robotService = new RobotService();
    }

    public async checkTokenIntegration(req: Request, res: Response) {
        const { integration_token } = req.body;
        
        const is_valid = await this.userRoleService.checkTokenIntegration(integration_token);

        return r(res, "", { is_valid });
    }

    public async listOperationAccounts(req: Request, res: Response) {
        const { integration_token, account_type, filter } = req.body;

        if (account_type !== "DEMO" && account_type !== "REAL") {
            throw new ValidationError("operation_account.invalid_operation_account_type");
        }
        
        const operations_account = await this.operationAccountService.listByToken(integration_token, account_type, filter);

        return r(res, "", operations_account);
    }

    public async getIntegrationToken(req: Request, res: Response) {
        const user_role: ILoggedUser = req.auth;

        const ret = await this.userRoleService.getById(user_role.user_role_id);

        return r(res, "", { integration_token: ret.integration_token });
    }

    public async startRobotRequest(req: Request, res: Response) {
        const { operation_account_id, robot_id, expires_at } = req.body;

        if (!operation_account_id) {
            throw new ValidationError("botmoney.missing_operation_account");
        }

        await this.robotService.startRobotRequest(operation_account_id, robot_id, expires_at);

        r(res, "success");
    }

    public async stopRobotRequest(req: Request, res: Response) {
        const { operation_account_id } = req.body;

        await this.robotService.stopRobotRequest(operation_account_id);

        r(res, "success");
    }

    public async synchronizeAccount(req: Request, res: Response) {
        const { integration_token, botmoney_reference } = req.body;

        if (!botmoney_reference) {
            throw new ValidationError("botmoney.missing_botmoney_reference");
        }

        if (!integration_token) {
            throw new ValidationError("botmoney.missing_integration_token");
        }

        await this.userRoleService.synchronizeBotmoneyAccount(integration_token, botmoney_reference);

        r(res, "success");
    }

}

export { BotmoneyController };