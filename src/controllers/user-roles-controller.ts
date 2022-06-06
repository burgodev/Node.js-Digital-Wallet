import { Response, Request } from "express";
import { r } from "../helpers/general";
import UserRoleService from "../services/user-role.service";

class UserRoleController {
    private service: UserRoleService;

    constructor() {
        this.service = new UserRoleService();
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const data = {
            user_id: req.body.user_id,
            role_id: req.body.role_id,
            password: req.body.password,
        };

        const user = await this.service.create(req.body.user_id, req.body.role_id, req.body.password);

        return r(res, "auth.login.registered", user);
    }
}

export default UserRoleController;
