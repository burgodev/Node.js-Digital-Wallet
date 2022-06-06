import UserRepository from "../../repositories/admin/user-repository";
import { IUser } from "../../types/user";

interface ListUsers extends IUser {
    waiting_validation: number;
}

class UserService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    public async list(): Promise<ListUsers[]> {
        return await this.repository.list();
    }

    public async listFilteredByStatus(): Promise<ListUsers[]> {
        return await this.repository.listStatusWaiting();
    }

    public async allUserInformation(user_id: string): Promise<any> {
        return await this.repository.allDataOfUser(user_id);
    }

    public async getUserDocuments(user_id: string): Promise<any> {
        return await this.repository.getDocumentsInformation(user_id);
    }
    public async getUserAddress(user_id: string): Promise<any> {
        return await this.repository.getAddress(user_id);
    }
}

export default UserService;
