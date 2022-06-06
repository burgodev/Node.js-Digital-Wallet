import ValidationError from "../../errors/validation-error";
import RoleRepository from "../../repositories/role-repository";
import UserRepository from "../../repositories/user-repository";
import UserRoleRepository from "../../repositories/user-role-repository";
import { IAddress } from "../../types/address";
import { ICreateUser, IUpdateUser, IUploadDocuments, IUser } from "../../types/user";
import { IUserRole } from "../../types/user-role";
import ProfileService from "../profile.service";
import UserRoleService from "../user-role.service";

class CreateUserService {
    private user_repository: UserRepository;
    private profile_service: ProfileService;
    private user_role_repository: UserRoleRepository;

    constructor() {
        this.user_repository = new UserRepository();
        this.profile_service = new ProfileService();
        this.user_role_repository = new UserRoleRepository();
    }

    private async getUserByEmailOrCode(email: string, user_id: string): Promise<string> {
        if (user_id) return user_id;
        const user = await this.user_repository.getByEmail(email);
        if (!user) throw new ValidationError("user.not_found");
        return user.id;
    }

    public async create(new_user: ICreateUser): Promise<IUser> {
        const role_repository = new RoleRepository();
        const role = await role_repository.findByName(new_user.role);
        let manager: IUserRole;

        if (!role) throw new ValidationError("role.not_found");

        if (new_user.manager_code) {
            manager = await this.user_role_repository.findByManagerCode(new_user.manager_code);
            const user = await this.user_repository.create(new_user);
            const user_role = await new UserRoleService().create(user.id, role.id, new_user.password,manager.id);
            return user;
        } else {
            const user_verification = await this.user_repository.getByEmail(new_user.email);
            if (user_verification) throw new ValidationError("user.already_exists");
            const user = await this.user_repository.create(new_user);
            const user_role = await new UserRoleService().create(user.id, role.id, new_user.password);
            return user;
        }
    }

    public async updateProfile(data: IUpdateUser): Promise<IUser | IAddress> {
        const user_id = await this.getUserByEmailOrCode(data.email, data.user_id);

        const profile = await this.profile_service.update(user_id, data);
        const address = await this.profile_service.updateAddress(user_id, data.address);

        return Object.assign(profile, address);
    }

    public async uploadDocuments(data: IUploadDocuments): Promise<Boolean> {
        const user_id = await this.getUserByEmailOrCode(data.email, data.user_id);

        return await this.profile_service.uploadDocuments(user_id, data.documents);
    }
}

export default CreateUserService;
