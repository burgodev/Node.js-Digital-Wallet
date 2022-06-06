import RoleRepository from "../repositories/role-repository";
import UserRoleRepository from "../repositories/user-role-repository";

class ManagerIndicationService {
    private user_role_repository: UserRoleRepository;
    private role_repository: RoleRepository;
    constructor() {
        this.user_role_repository = new UserRoleRepository();
        this.role_repository = new RoleRepository();
    }

    public async generateLinkToUserWithoutAccountBecomeManager(user_id: string) {
        const managerData = await this.findManagerData(user_id);
        return `${process.env.APP_URL}/register_manager/${managerData[0].manager_code}`;
    }

    public async generateLinkToUserWithoutAccountBecomeClient(user_id: string) {
        const managerData = await this.findManagerData(user_id);
        return `${process.env.APP_URL}/register/${managerData[0].manager_code}`;
    }

    public async generateLinkToClientBecomeManager(user_id: string) {
        const managerData = await this.findManagerData(user_id);
        return `${process.env.APP_URL}/turn-manager/${managerData[0].manager_code}`;
    }

    public async listIndications(user_id: string) {
        const managerData = await this.findManagerData(user_id);
        return await this.user_role_repository.findUserRolesByManager(managerData[0].id);
    }

    private async findManagerData(user_id: string) {
        const role = await this.role_repository.findByName("Manager");
        return await this.user_role_repository.findByUserIDWithoutPassword(user_id, role.id);
    }
}

export default ManagerIndicationService;
