import { Response, Request } from 'express';
import { r } from '../../helpers/general';
import EmailConfirmationService from '../../services/auth/email-confirmation.service';

class EmailConfirmationController {

    private service: EmailConfirmationService;

    constructor() {
        this.service = new EmailConfirmationService();
    }

    public async validate(req: Request, res: Response): Promise<Response> {
        const { token } = req.body;

        await this.service.validateToken(token);

        return r(res, 'email.validated');
    }

}

export default EmailConfirmationController;