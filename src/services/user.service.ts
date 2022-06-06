import UserRepository from "../repositories/user-repository";
import { IUser } from "../types/user";

class UserService {
    private user_repository: UserRepository;

    constructor() {
        this.user_repository = new UserRepository();
    }

    public async getUserByEmail(email: string): Promise<IUser> {
        return await this.user_repository.getByEmail(email);
    }

}

export default UserService;