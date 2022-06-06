import { Response, Request } from "express";
import APIError from "../../errors/api-error";
import ValidationError from "../../errors/validation-error";
import { r } from "../../helpers/general";
import AcceptanceTermHistoriesRepository from "../../repositories/acceptance_term_histories-repository";
import CreateClientUserService from "../../services/auth/create-client-user.service";
import EmailConfirmationService from "../../services/auth/email-confirmation.service";
import { ILogInfosRequest } from "../../types/action-log";
import { AcceptanceTerms, ICreateUser } from "../../types/user";

class ClientRegisterController {
    private service: CreateClientUserService;
    private acceptance_term_histories_repository:AcceptanceTermHistoriesRepository

    constructor() {
        this.acceptance_term_histories_repository = new AcceptanceTermHistoriesRepository()
        this.service = new CreateClientUserService();
    }

    public async register(req: Request, res: Response): Promise<Response> {
        const {
            email,
            first_name,
            last_name,
            password,
            password_confirm,
            nationality_id,
            role,
            ip,
            device_type,
            mac_address,
            manager_code,
            acceptance_term_id,
            accepted
        } = req.body;

        if (password !== password_confirm) throw new ValidationError("auth.validations.passwords_differs");
        if (!acceptance_term_id && !accepted) throw new ValidationError("auth.validations.lack_acceptance_terms")

        const new_user: ICreateUser = {
            email,
            first_name,
            last_name,
            password,
            nationality_id,
            role,
            manager_code,
        };

        const user = await this.service.create(new_user);

        const acceptanceTerms: AcceptanceTerms = {
            acceptance_term_id: acceptance_term_id,
            user_id: user.id,
            accepted: accepted,
            date: new Date()
        };

        console.log('dasuhduashdasuduashuashduas',acceptanceTerms)

        await this.acceptance_term_histories_repository.create(acceptanceTerms)

        const email_confirmation_service = new EmailConfirmationService();
        const email_sended = await email_confirmation_service.create(user);
        if (!email_sended) throw new APIError("email.check.send_error");

        return r(res, "user.created");
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { email, first_name, last_name, birth_date, document_number, phone_number, address } = req.body;

        await this.service.updateProfile({
            email,
            first_name,
            last_name,
            birth_date,
            phone_number,
            document_number,
            address,
        });

        return r(res, "user.updated");
    }

    public async documents(req: Request, res: Response): Promise<Response> {
        const { email, documents } = req.body;

        await this.service.uploadDocuments({
            email,
            documents,
        });

        return r(res, "user.updated");
    }
}

export default ClientRegisterController;
