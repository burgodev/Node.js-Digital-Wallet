import { Request, Response } from "express";
import { IOperationAccountCreateRequest } from "../types/operation-account";
import { r } from "../helpers/response";
import OperationAccountService from "../services/operation-account.service";
import { ILoggedUser } from "../types/auth";

class OperationAccountController {
    private operationAccountService: OperationAccountService;

    constructor(operationAccountService: OperationAccountService) {
        this.operationAccountService = operationAccountService;
    }

    public async create(request: Request, response: Response) {
        const data: IOperationAccountCreateRequest = request.body;
        const user: ILoggedUser = request.auth;

        const ret = await this.operationAccountService.create(user, data);

        return r(response, "", ret);
    }

    public async listReals(request: Request, response: Response) {
        const user: ILoggedUser = request.auth;

        const ret = await this.operationAccountService.listReals(user.user_role_id);

        return r(response, "", ret);
    }

    public async listDemos(request: Request, response: Response) {
        const user: ILoggedUser = request.auth;

        const ret = await this.operationAccountService.listDemos(user.user_role_id);

        return r(response, "", ret);
    }

    public async update(request: Request, response: Response) {
        /*const {} = request.body;
        
        const ret = await  this.operationAccountService.update();
        
        return r(response, "", ret);*/
    }

}

export default OperationAccountController;