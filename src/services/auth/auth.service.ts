import { l } from "../../helpers/general";
import bcrypt from "bcrypt";
import fs from "fs";
import jwt from "jsonwebtoken";
import ValidationError from "../../errors/validation-error";
import UserRepository from "../../repositories/user-repository";
import UserRoleRepository from "../../repositories/user-role-repository";
import { ILogInfosRequest } from "../../types/action-log";
import ActionLogService from "../action-log.service";
import RoleRepository from "../../repositories/role-repository";
import AcceptanceTermsRepository from "../../repositories/acceptance_term-repository";
import UnauthenticatedError from "../../errors/unauthenticated-error";

class AuthService {
    private userRepository: UserRepository;
    private userRoleRepository: UserRoleRepository;
    private actionLogService: ActionLogService;
    private acceptanceTermsRepository: AcceptanceTermsRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.userRoleRepository = new UserRoleRepository();
        this.actionLogService = new ActionLogService();
        this.acceptanceTermsRepository = new AcceptanceTermsRepository();
    }

    public async login(
        email: string,
        password: string,
        log_infos: ILogInfosRequest
    ): Promise<{ token: string; role: string; first_login: boolean }> {
        const user = await this.userRepository.getByEmail(email);
        if (!user) throw new ValidationError("user.not_found");

        const roles = await this.userRoleRepository.getUserRoles(user.id);
        if (!roles) throw new ValidationError("user.role.not_found");

        let pass_valid = false;
        let user_role_id = null;
        let role_id = null;

        for (const user_role of roles) {
            if (pass_valid) break;
            pass_valid = await bcrypt.compare(password, user_role.password);

            if (pass_valid) {
                user_role_id = user_role.id;
                role_id = user_role.role_id;
            }
        }

        if (!pass_valid) throw new ValidationError("auth.credentials.invalid");

        if (user.email_checked_at === null)
            throw new UnauthenticatedError("auth.email_confirmation.email_not_verified", { email_not_verified: true });

        const role_repository = new RoleRepository();
        const role = await role_repository.find(role_id);

        const privateKey = fs.readFileSync(`${__dirname}/../../certs/private.key`);
        const token = jwt.sign(
            {
                user_id: user.id,
                user_role_id: user_role_id,
            },
            privateKey,
            {
                expiresIn: "1d",
                algorithm: "RS256",
            }
        );

        const first_login = await this.isFirstLogin(user_role_id);
        await this.actionLogService.login(log_infos, user_role_id);

        return {
            token,
            role,
            first_login,
        };
    }

    public async getAcceptanceTerms() {
        return this.acceptanceTermsRepository.list();
    }

    private async isFirstLogin(user_role_id: string): Promise<boolean> {
        const logins = await this.actionLogService.getLoginsByUserRole(user_role_id);

        return logins.length == 0;
    }
}

export default AuthService;
