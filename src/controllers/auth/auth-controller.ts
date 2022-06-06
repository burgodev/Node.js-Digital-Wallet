import { Response, Request } from "express";
import ValidationError from "../../errors/validation-error";
import { l, r } from "../../helpers/general";
import AuthService from "../../services/auth/auth.service";
import { ILogInfosRequest } from "../../types/action-log";

class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    public async login(req: Request, res: Response): Promise<Response> {
        const { email, password, ip, device_type, mac_address } = req.body;

        const log_infos: ILogInfosRequest = {
            ip,
            device_type,
            mac_address
        }

        if (!email || !password) throw new ValidationError("auth.credentials.invalid");

        const response = await this.service.login(email, password, log_infos);

        return r(res, "auth.login.success", response);
    }
    
    public async getAcceptanceTerm(req:Request, res:Response):Promise<Response> {
        const response = await this.service.getAcceptanceTerms()
        return r(res,"",response)
    }
}

export default AuthController;
