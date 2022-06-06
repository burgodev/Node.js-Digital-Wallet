import { IPasswordRecovery } from "../types/password-recovery";
import BaseRepository from "./base-repository";

export default class PasswordRecoveryRepository extends BaseRepository {

    protected select_arguments = {
        id: true,
        token: true,
        user_role_id: true,
        expires_at: true,
        created_at: true,
        is_valid: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.passwordRecovery);
    }

    public async create(data: Partial<IPasswordRecovery>): Promise<IPasswordRecovery> {
        return this.client.create({
            data: data,
            select: this.select_arguments
        });
    }

    public async hasRequestedInLastMinutes(user_role_id: string, minutes: number): Promise<boolean> {
        const now = new Date();

        const password_recovery = await this.client.findFirst({
            where: {
                user_role_id,
                is_valid: true,
                created_at: {
                    gte: (new Date(now.setMinutes(now.getMinutes() - minutes))).toISOString()
                }
            },
            select: {
                id: true,
            }
        });

        return password_recovery != null;
    }

    public async tokenIsValid(token: string): Promise<string> {
        const password_recovery = await this.client.findFirst({
            where: {
                token, 
                is_valid: true,
                expires_at: {
                    gte: (new Date()).toISOString()
                }
            },
            select: {
                id: true,
                user_role_id: true,
            }
        });

        return password_recovery?.user_role_id;
    }

    public async invalidateToken(token: string): Promise<void> {
        await this.client.update({
            where: {
                token: token,
            }, 
            data: {
                is_valid: false,
            },
        });
    }

}