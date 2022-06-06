import { Response, Request } from "express";
import ValidationError from "../../errors/validation-error";
import { r } from "../../helpers/general";
import CreateManagerService from "../../services/auth/create-manager.service";

class ManagerRegisterController {
    private service: CreateManagerService;

    constructor() {
        this.service = new CreateManagerService();
    }

    public async register(req: Request, res: Response): Promise<Response> {
        const {
            email,
            first_name,
            last_name,
            nationality_id, role,
            birth_date,
            document_number,
            phone_number,
            address,
            documents,
            accepted,
            manager_code,
            acceptance_term_id,
     } = req.body;

        const data = {
            email,
            first_name,
            last_name,
            nationality_id, role,
            birth_date,
            document_number,
            phone_number,
            address,
            manager_code,
            documents,
            accepted,
            acceptance_term_id,
            date:new Date()
        }
        if (!acceptance_term_id && !accepted) throw new ValidationError("auth.validations.lack_acceptance_terms")

        const manager = await this.service.createManager(data);

        return r(res, "manager.created");
    }

    public async resendEmailWithPassword(req: Request, res: Response) {
        const response = await this.service.resendEmailWithPassword(req.body.email)
        return r(res, "email.with.password.send")
    }

    public async emailVerification(req:Request,res:Response) {
        const response = await this.service.emailVerification(req.body.email)
        if (response==='User not found') return r(res,"user.not_found")
        
        throw new ValidationError( "user.already_exists")
    }   
}

export default ManagerRegisterController;
