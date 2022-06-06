import { EmailConfirmation } from "../types/email-confirmation";
import BaseRepository from "./base-repository";
import { formatDateToDB } from "../helpers/general";

export default class EmailConfirmationRepository extends BaseRepository {

    protected select_arguments = {
        id: true,
        token: true,
        email: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.emailValidation);
    }

    public async create(data: Partial<EmailConfirmation>): Promise<EmailConfirmation> {
        return this.client.create({
            data: data,
            select: this.select_arguments
        });
    }

    public async tokenIsValid(token: string): Promise<string> {
        const email_confirmation = await this.client.findFirst({
            where: {
                token,
                is_active: true,
            },
            select: {
                user_id: true,
            }
        });

        return email_confirmation?.user_id || null;
    }

    public async invalidateToken(token: string): Promise<void> {
        this.client.update({
            where: {
                token,
            },
            data: {
                is_active: false,
            }
        })
    }

    public async checked(token: string): Promise<void> {
        this.client.update({
            where: {
                token,
            },
            data: {
                is_active: false,
                email_checked_at: formatDateToDB(new Date()),
            }
        })
    }

}