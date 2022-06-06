import APIError from "../../errors/api-error";
import ValidationError from "../../errors/validation-error";
import { generateUUID } from "../../helpers/general";
import EmailConfirmationRepository from "../../repositories/email-confirmation-repository";
import UserRepository from "../../repositories/user-repository";
import { IUser } from "../../types/user";
import EmailService from "../mail/mail.service";

class EmailConfirmationService {
    private email_service: EmailService;
    private repository: EmailConfirmationRepository;

    constructor() {
        this.email_service = new EmailService();
        this.repository = new EmailConfirmationRepository();
    }

    private async sendEmail(user: IUser, token: string): Promise<boolean> {
        const url = `${process.env.APP_URL}/auth/email-confirmation/${token}`;

        return await this.email_service.send({
            destination: user.first_name
                ? {
                      name: user.first_name,
                      email: user.email,
                  }
                : user.email,
            subject: "Select Markets - Email confirmation",
            text: `${user.first_name}, this is your confirmation email. (${url})`,
            html: {
                path: "email-confirmation.html",
                args: {
                    url: url,
                    email_confimation_title: {
                        translate: "auth.email_confirmation.title",
                        args: {
                            user_name: user.first_name as string,
                        },
                    },
                    email_confirmation_bt: {
                        translate: "auth.email_confirmation.bt",
                    },
                },
            },
        });
    }

    public async create(user: IUser): Promise<boolean> {
        const token = generateUUID();

        const email_confirmation = this.repository.create({
            user_id: user.id,
            email: user.email,
            token,
        });

        if (email_confirmation == null) throw new APIError("Something is wrong");

        return await this.sendEmail(user, token);
    }

    public async validateToken(token: string): Promise<string> {
        const user_id = await this.repository.tokenIsValid(token);

        if (user_id) {
            await this.repository.checked(token);
            const user_repository = new UserRepository();
            await user_repository.emailChecked(user_id);
        } else {
            throw new ValidationError('token.invalid');
        }

        return user_id;
    }
}

export default EmailConfirmationService;
