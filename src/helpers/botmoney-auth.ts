import { ILoggedUser } from "../types/auth";
import UserRoleRepository from "../repositories/user-role-repository";
import ValidationError from "../errors/validation-error";

const botmoneyAuth = async (token): Promise<ILoggedUser> => {
    const user = await new UserRoleRepository().findByIntegrationToken(token);
    
    if (!user) {
        throw new ValidationError("auth.credentials.invalid_integration_token");
    }

    return {
        user_id: null, // seems to be not required for botmoney integration
        user_role_id: user.id
    };
}

export default botmoneyAuth;