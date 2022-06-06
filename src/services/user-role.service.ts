import bcrypt from "bcrypt";
import ValidationError from "../errors/validation-error";
import UserRoleRepository from "../repositories/user-role-repository";
import MT5Api from "../helpers/mt5-api";
import UserRepository from "../repositories/user-repository";
import { IUserRole } from "../types/user-role";
import { IUser } from "../types/user";
import RoleRepository from "../repositories/role-repository";
import generatePassword from "../helpers/generate-password";

class UserRoleService {
    private repository: UserRoleRepository;
    private user_repository: UserRepository;
    private role_repository: RoleRepository;

    constructor() {
        this.repository = new UserRoleRepository();
        this.user_repository = new UserRepository();
        this.role_repository = new RoleRepository();
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(12);
        return await bcrypt.hash(password, salt);
    }

    public async create(user_id: string, role_id: string, password: string, manager_id?: string): Promise<IUserRole> {
        const password_hash = await this.hashPassword(password);
        const role = await this.role_repository.find(role_id);
        let manager_code: string;

        if (role === "Manager") {
            manager_code = generatePassword(6);
        }

        const verification_role = await this.repository.getUserRoles(user_id, role_id);

        if (verification_role.length > 0) {
            throw new ValidationError("user.role.already_exist");
        }

        const created_user_role = await this.repository.create(
            user_id,
            role_id,
            password_hash,
            manager_id,
            manager_code
        );

        return created_user_role;
    }

    public async changePassword(user_role_id: string, password: string): Promise<void> {
        const user_role = await this.repository.findWithPass(user_role_id);
        if (!user_role) throw new ValidationError("user.role.not_found");

        const password_valid = await this.passwordIsValid(user_role.user_id, password);
        if (!password_valid) throw new ValidationError("user.role.password_invalid");

        await this.repository.changePassword(user_role_id, password);
    }

    public async passwordIsValid(user_id: string, password: string): Promise<boolean> {
        const user_roles = await this.repository.listAllFromUser(user_id);

        for (let user_role of user_roles) {
            const match = await bcrypt.compare(password, user_role.password);
            if (match) return false;
        }

        return true;
    }

    private async createMetatraderClient(user_id: string, user_role_id: string) {
        const user: IUser = await this.user_repository.find(user_id);

        const new_meta_client = [
            {
                PersonName: user.first_name,
                PersonLastName: user.last_name,
                ClientType: "1",
                ClientStatus: "700",
                AssignedManager: "1000",
            },
        ];

        //const mt5_ret: IClientCreateReturn[] = await MT5Api.post("/client/add", new_meta_client, "");
        const mt5_ret = await MT5Api.post("/client/add", new_meta_client);

        const client_id = mt5_ret[0].id;

        await this.repository.updateMetatraderClientId(user_role_id, client_id);
    }

    public async checkTokenIntegration(supplied_token: string): Promise<Boolean> {
        if (!supplied_token) {
            return false;
        }

        const user = await this.repository.findByIntegrationToken(supplied_token);

        if (!user) {
            return false;
        }

        return true;
    }

    public async getById(user_role_id: string) {
        const user_role = await this.repository.getById(user_role_id);

        return user_role;
    }

    public async synchronizeBotmoneyAccount(integration_token: string, botmoney_reference: string) {
        const user_role = await this.repository.findByIntegrationToken(integration_token);

        if (user_role.integrated_account_id) {
            throw new ValidationError("This account is already integrated with a robot plataform!");
        }

        await this.repository.updateIntegratedAccount(user_role.id, botmoney_reference);
    }

}
export default UserRoleService;
