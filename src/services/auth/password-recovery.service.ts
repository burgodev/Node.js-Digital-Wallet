import APIError from "../../errors/api-error";
import ValidationError from "../../errors/validation-error";
import { generateUUID } from "../../helpers/general";
import PasswordRecoveryRepository from "../../repositories/password-recovery-repository";
import UserRepository from "../../repositories/user-repository";
import UserRoleRepository from "../../repositories/user-role-repository";
import { IUser } from "../../types/user";
import EmailService from "../mail/mail.service";

class PasswordRecoveryService {
    private email_service: EmailService;
    private repository: PasswordRecoveryRepository;

    constructor() {
        this.email_service = new EmailService();
        this.repository = new PasswordRecoveryRepository();
    }

    private async sendEmail(user: IUser, token: string): Promise<boolean> {
        const url = `${process.env.APP_URL}/auth/password-recovery/${token}`;

        return await this.email_service.send({
            destination: user.first_name
                ? {
                      name: user.first_name,
                      email: user.email,
                  }
                : user.email,
            subject: "Select Markets - Password recovery",
            text: `${user.first_name}, you requested password recovery on our system. To be able to make the exchange, access the link below and reset your password. (${url})`,
            html: {
                path: "password-recovery.html",
                args: {
                    url: url,
                    email_password_recovery_title: {
                        translate: "auth.pessword_recovery.title",
                        args: {
                            user_name: user.first_name as string,
                        },
                    },
                    password_recovery_bt: {
                        translate: "auth.pessword_recovery.bt",
                    },
                },
            },
        });
    }

    public async hasRequestedInLastMinutes(user_role_id: string, minutes = 5): Promise<boolean> {
        return await this.repository.hasRequestedInLastMinutes(user_role_id, minutes);
    }

    public async request(email: string, role_id: string = null): Promise<boolean | string[]> {
        const user_repository = new UserRepository();
        const user = await user_repository.getByEmail(email);
        if (!user) throw new ValidationError("user.not_found");

        const user_role_repository = new UserRoleRepository();
        const roles = await user_role_repository.getUserRoles(user.id, role_id);
        if (!roles) throw new ValidationError("user.role.not_found");

        if (roles.length > 1) {
            return roles.map((r) => r.role_id);
        }

        const user_role = roles[0];

        if (await this.hasRequestedInLastMinutes(user_role.id))
            throw new ValidationError("auth.pessword_recovery.already_requested");

        return await this.create(user, user_role.id);
    }

    public async create(user: IUser, user_role_id: string): Promise<boolean> {
        const token = generateUUID();
        const now = new Date();

        const password_recovery = this.repository.create({
            user_role_id,
            token,
            expires_at: new Date(now.setMinutes(now.getMinutes() + 30)),
        });

        if (password_recovery == null) throw new APIError("Something is wrong");

        return await this.sendEmail(user, token);
    }

    public async validateToken(token: string): Promise<string> {
        const user_id = await this.repository.tokenIsValid(token);

        if (user_id) {
            await this.repository.invalidateToken(token);
        }

        return user_id;
    }
}

export default PasswordRecoveryService;
