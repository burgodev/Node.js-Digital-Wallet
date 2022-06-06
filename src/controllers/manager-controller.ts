import { Response, Request } from "express";
import { r } from "../helpers/general";
import ManagerIndicationService from "../services/manager-indication.service";

class ManagerController {
    private service: ManagerIndicationService;

    constructor() {
        this.service = new ManagerIndicationService();
    }

    public async generateLinkToClientBecomeManager(req: Request, res: Response): Promise<Response> {
        const link = await this.service.generateLinkToClientBecomeManager(req.auth.user_id);
        return r(res, "", { link });
    }

    public async generateLinkToUserWithoutAccountBecomeManager(req: Request, res: Response): Promise<Response> {
        const link = await this.service.generateLinkToUserWithoutAccountBecomeManager(
            req.auth.user_id
        );
        return r(res, "", { link });
    }

    public async generateLinkToUserWithoutAccountBecomeClient(req: Request, res: Response): Promise<Response> {
        const link = await this.service.generateLinkToUserWithoutAccountBecomeClient(
            req.auth.user_id
        );
        return r(res, "", { link });
    }

    public async listIndications(req: Request, res: Response): Promise<Response> {
        const manager_indications = await this.service.listIndications(req.auth.user_id);
        return r(res, "",  manager_indications );
    }
}

export default ManagerController;
