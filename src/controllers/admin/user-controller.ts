import { Response, Request } from "express";
import { r } from "../../helpers/general";
import UserService from "../../services/admin/user.service";

class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    public async list(req: Request, res: Response): Promise<Response> {
        const users = await this.service.list();
        return r(res, "user.list", users);
    }

    public async allUserInformation(req: Request, res: Response): Promise<Response> {
        const user = await this.service.allUserInformation(req.body.user_id);
        return r(res, "", user);
    }

    public async getDocumentsInformation(req: Request, res: Response): Promise<Response> {
        const user = await this.service.getUserDocuments(req.body.user_id);
        return r(res, "", user);
    }

    public async getAddressInformation(req: Request, res: Response): Promise<Response> {
        const user = await this.service.getUserAddress(req.body.user_id);
        return r(res, "", user);
    }
}

export default UserController;
