import { ResponseContentDisposition } from "aws-sdk/clients/s3";
import { Response, Request } from "express";
import { r } from "../helpers/general";
import SupportService from "../services/commercial.service";

class SupportController {
    private service: SupportService;

    constructor() {
        this.service = new SupportService();
    }

    public async listAllIndicationsByManagersToManagersAcc(req: Request, res: Response): Promise<Response> {
        const user_roles = await this.service.listAllIndicationsByManagersToManagersAccount()
        return r(res, "", user_roles);
    }

    public async listAllNewUsersToManager(req: Request, res: Response): Promise<Response> {
        const user_roles = await this.service.listAllSolicationsOfNewUsersToBecomeManager()
        return r(res, "", user_roles);
    }

    public async listAllManagersWaitingStatus(req: Request, res: Response): Promise<Response> {
        const user_roles = await this.service.listAllManagersWaiting()
        return r(res, "", user_roles);
    }

    public async listAllClientsWaitingToBeManagers(req: Request, res: Response): Promise<Response> {
        const user_roles = await this.service.listAllClientWaitingToBeManagers()
        return r(res, "", user_roles);
    }

    public async activeManager(req: Request, res: Response): Promise<Response> {
        await this.service.activeSolicitationToManager(req.body.user_id)
        return r(res,"Manager solicitation activated");
    }

    public async refuseManager(req: Request, res: Response): Promise<Response> {
        await this.service.refuseSolicitationToManager(req.body.user_id)
        return r(res,"Manager solicitation rejected");
    }

    public async allUserData(req: Request, res: Response): Promise<Response> {
        await this.service.refuseSolicitationToManager(req.body.user_id)
        return r(res,"Manager solicitation rejected");
    }

    public async listAllMangersWaitingForValidation(req:Request,res:Response):Promise<Response>{
        const user_roles = await this.service.listAllManagersWaitingForValidation()
        return r(res, "", user_roles);
    } 

    public async listAllUserWithRoleClientAndManager(req:Request,res:Response):Promise<Response> {
        const user_roles = await this.service.listClientsAndManagers()
        return r(res,"",user_roles)
    }
    
}
export default SupportController;
