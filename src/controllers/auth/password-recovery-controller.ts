import { Response, Request } from 'express';
import APIError from '../../errors/api-error';
import ValidationError from '../../errors/validation-error';
import { l, r } from '../../helpers/general';
import PasswordRecoveryService from '../../services/auth/password-recovery.service';
import UserRoleService from '../../services/user-role.service';

class PasswordRecoveryController {

    private service: PasswordRecoveryService;

    constructor() {
        this.service = new PasswordRecoveryService();
    }

    public async requestPasswordRecovery(req: Request, res: Response): Promise<Response> {
        const { email, role_id } = req.body;

        const sended = await this.service.request(email, role_id);
        if (!sended) throw new APIError('mail.send.error');

        l.info("User asked to changed his password", { user: email, role: role_id });
        return r(res, "auth.pessword_recovery.requested");
    }

    public async passwordRecovery(req: Request, res: Response): Promise<Response> {
        const { token, password, password_confirm } = req.body;

        if (password != password_confirm) throw new ValidationError("auth.validations.passwords_differs");

        const user_role_id = await this.service.validateToken(token);
        if (user_role_id == null) throw new ValidationError('token.invalid');

        await new UserRoleService().changePassword(user_role_id, password);

        return r(res, "auth.pessword_recovery.changed");
    }

}

export default PasswordRecoveryController;