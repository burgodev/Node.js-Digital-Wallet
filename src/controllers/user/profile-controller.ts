import { Response, Request } from "express";
import ValidationError from "../../errors/validation-error";
import { r } from "../../helpers/general";
import ProfileService from "../../services/profile.service";

class ProfileController {
    private service: ProfileService;

    constructor() {
        this.service = new ProfileService();
    }

    public async getData(req: Request, res: Response): Promise<Response> {
        const user_id = req.auth.user_id;
        const data = await this.service.getData(user_id);
        return r(res, '', data);
    }

    public async getDocuments(req: Request, res: Response): Promise<Response> {
        const user_id = req.auth.user_id;
        const docs = await this.service.getDocuments(user_id);
        return r(res, '', docs);
    }

    public async changePassword(req: Request, res: Response): Promise<Response> {
        const user_role_id = req.auth.user_role_id;
        const { old_password, password, password_confirm } = req.body;

        if (password !== password_confirm) throw new ValidationError("auth.validations.passwords_differs");

        await this.service.changePassword(user_role_id, old_password, password);

        return r(res, "user.profile.change_password.changed");
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const user_id = req.auth.user_id;
        const { email, first_name, last_name, birth_date, document_number, phone_number, address } = req.body;

        await this.service.update(user_id, {
            email,
            first_name,
            last_name,
            birth_date,
            phone_number,
            document_number,
            address,
        });
        
        await this.service.updateAddress(user_id, address);
        return r(res, "user.profile.updated");
    }

    public async documents(req: Request, res: Response): Promise<Response> {
        const user_id = req.auth.user_id;
        const { documents } = req.body;
        await this.service.uploadDocuments(user_id, documents);
        return r(res, "user.profile.documents.uploaded");
    }
    
    public async getIntegrationToken(req:Request, res: Response): Promise<Response>{
        const user_role_id = req.auth.user_role_id
        const integration_token = await this.service.getIntegrationToken(user_role_id)
        return r(res,"",{integration_token})
    }
}
export default ProfileController;
