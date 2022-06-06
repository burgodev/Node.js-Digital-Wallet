import APIError from "../errors/api-error";
import generatePassword from "../helpers/generate-password";
import RoleRepository from "../repositories/role-repository";
import UserRepository from "../repositories/user-repository";
import UserRoleRepository from "../repositories/user-role-repository";

import EmailService from "./mail/mail.service";

export interface SendEmailWithPasswordManager {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

class SupportService {
    private user_role_repository: UserRoleRepository;
    private role_repository: RoleRepository;
    private user_repository: UserRepository;
    private email_service: EmailService;

    constructor() {
        this.user_role_repository = new UserRoleRepository();
        this.role_repository = new RoleRepository();
        this.email_service = new EmailService();
        this.user_repository = new UserRepository();
    }

    public async listAllSolicationsOfNewUsersToBecomeManager() {
        const manager_type = await this.role_repository.findByName("Manager");
        const usersWaiting = await this.user_role_repository.listNewUsersWithStatusWaiting();
        const managersWaiting = usersWaiting.filter((user) => {
            return user.role_id === manager_type.id;
        });
        return managersWaiting;
    }

    public async listAllIndicationsByManagersToManagersAccount() {
        const usersWaiting = await this.user_role_repository.allIndicationsByManagers();
        const manager_type = await this.role_repository.findByName("Manager");
        const managersWaiting = usersWaiting.filter((user) => {
            return user.role_id === manager_type.id;
        });
        return managersWaiting;
    }

    public async listAllManagersWaiting() {
        const usersWaiting = await this.user_role_repository.listAllWithStatusWaiting();
        const manager_type = await this.role_repository.findByName("Manager");
        const managersWaiting = usersWaiting.filter((user) => {
            return user.role_id === manager_type.id;
        });

        return managersWaiting;
    }

    public async listAllClientWaitingToBeManagers() {
        const manager_type = await this.role_repository.findByName("Manager");
        const clientsWaitingToBeManagers = await this.user_role_repository.listClientWaitingToBeManagers();
        const managersWaiting = await clientsWaitingToBeManagers.filter((user) => {
            return user.role_id === manager_type.id;
        });
        return managersWaiting;
    }

    public async activeSolicitationToManager(user_id: string) {
        const newPassword = generatePassword()
        const manager_type = await this.role_repository.findByName("Manager");
        const user_role = await this.user_role_repository.findByUserIDWithPassword(user_id, manager_type.id);
        const user = await this.user_repository.find(user_role[0].user_id);
        // await this.user_role_repository.updatedStatus(user_role[0].id, "ACTIVE");
        await this.user_role_repository.changePassword(user_role[0].id, newPassword);

        try {
            await this.sendEmailWithPassword({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: newPassword,
            });
        } catch (e) {
            throw new APIError(e);
        }
    
    }

    public async refuseSolicitationToManager(user_id: string) {
        const manager_type = await this.role_repository.findByName("Manager");
        const user_role = await this.user_role_repository.findByUserIDWithoutPassword(user_id, manager_type.id);
        await this.user_role_repository.updatedStatus(user_role[0].id, "REFUSED");
    }

    public async listAllManagersWaitingForValidation() {
        const usersWaiting = await this.user_role_repository.listManagersWaitingForValidation();
        const manager_type = await this.role_repository.findByName("Manager");
        const managersWaiting = usersWaiting.filter((user) => {
            return user.role_id === manager_type.id && user.status === "WAITING";
        });

        return managersWaiting;
    }

    public async listClientsAndManagers() {
        return  await this.user_role_repository.listUsersWithRolesClientAndManager();
    }


    private async sendEmailWithPassword(user: SendEmailWithPasswordManager) {
        try {
            const response = await this.email_service.send({
                destination: user.first_name
                    ? {
                          name: user.first_name,
                          email: user.email,
                      }
                    : user.email,
                subject: "Manager Password",
                text: `${user.first_name},your register as manager was finished and here is your password to first access`,
                html: {
                    path: "password-manager.html",
                    args: {
                        email_password_generation_title: {
                            translate: "auth.password_generation.title",
                            args: {
                                user_name: user.first_name as string,
                            },
                        },
                        email_password_generation_body: {
                            translate: "auth.password_generation.body",
                            args: {
                                password: user.password as string,
                            },
                        },
                    },
                },
            });

            if (response) {
                return "Email send with success";
            }
        } catch (e) {
            throw new APIError(e);
        }
    }
}

export default SupportService;
