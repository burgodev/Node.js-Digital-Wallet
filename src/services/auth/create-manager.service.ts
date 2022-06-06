import ValidationError from "../../errors/validation-error";
import generatePassword from "../../helpers/generate-password";
import UserRepository from "../../repositories/user-repository";
import { ICreateUser, IUpdateUser, IUploadDocuments, IUser, ICreateManager, AcceptanceTerms } from "../../types/user";
import CreateUserService from "./create-user.service";
import EmailService from "../mail/mail.service";
import UserRoleRepository from "../../repositories/user-role-repository";
import RoleRepository from "../../repositories/role-repository";
import APIError from "../../errors/api-error";
import AcceptanceTermHistoriesRepository from "../../repositories/acceptance_term_histories-repository";
import UserRoleService from "../../services/user-role.service";


export interface SendEmailWithPasswordManager {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

class CreateManagerService {
    private user_repository: UserRepository;
    private create_user_service: CreateUserService;
    private email_service: EmailService;
    private user_role_repository: UserRoleRepository;
    private role_repository: RoleRepository;
    private acceptance_term_histories_repository:AcceptanceTermHistoriesRepository
    private user_role_service: UserRoleService

    constructor() {
        this.user_repository = new UserRepository();
        this.create_user_service = new CreateUserService();
        this.email_service = new EmailService();
        this.user_role_repository = new UserRoleRepository();
        this.user_role_service = new UserRoleService()
        this.role_repository = new RoleRepository();
        this.acceptance_term_histories_repository = new AcceptanceTermHistoriesRepository()
    }

    public async createManager(data: ICreateManager): Promise<Boolean> {
        const passwordGenerated = generatePassword();

        const dataToCreateClient: ICreateUser = {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: passwordGenerated,
            nationality_id: data.nationality_id,
            role: "Manager",
        };

        const dataComplementary: IUpdateUser = {
            user_id: data.user_id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            birth_date: data.birth_date,
            phone_number: data.phone_number,
            document_number: data.document_number,
            address: data.address,
        };
        const documentsToUpload: IUploadDocuments = {
            documents: data.documents,
            email: data.email,
        };

        const userClient = await this.createUserRole(dataToCreateClient);

        if (data.manager_code) {
            const role = await this.role_repository.findByName("Manager");
            const user_role = await this.user_role_repository.findByUserIDWithoutPassword(userClient.id, role.id);
            const managerIndicator = await this.user_role_repository.findByManagerCode(data.manager_code)
            const managerIdUpdated = await this.updateUserRoleManagerId(user_role[0].id,managerIndicator.id)
        }

        const userUpdated = await this.updateProfileWithComplementaryData(dataComplementary);
        const documentsUpload = await this.uploadDocumentsToUser(documentsToUpload);
        
        if (!userClient) throw new ValidationError("manager.not_created");

        const acceptanceTerms: AcceptanceTerms = {
            acceptance_term_id: data.acceptance_term_id,
            user_id: userClient.id,
            accepted: data.accepted,
            date: new Date()
        };

        const acceptanceTermsHistory = await this.acceptance_term_histories_repository.create(acceptanceTerms)
        // if(!userUpdated) throw new ValidationError('manager.complementary.information.not.created')
        if (documentsUpload === false) throw new ValidationError("user.documents.not_uploaded");
        
        return true;
    }

    public async resendEmailWithPassword(email: string) {
        const user = await this.user_repository.getByEmail(email);
        const role = await this.role_repository.findByName("Manager");
        const user_role = await this.user_role_repository.findByUserIDWithPassword(user.id, role.id);
        const passwordNew = generatePassword();
        const passwordUpdated = await this.user_role_service.changePassword(user_role[0].id, passwordNew);

        if (user && user_role ) {
            try {
                await this.sendEmailWithPassword({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    password: passwordNew,
                });
              
            } catch (e) {
                throw new APIError(e);
            }
        } else return new APIError("error.password_generation");
    }

    public async emailVerification(email:string) :Promise<IUser|String> {
        const user = await this.user_repository.getByEmail(email); 

        if (!user) return "User not found"

    }

    private async createUserRole(data: ICreateUser): Promise<IUser> {
        return await this.create_user_service.create(data);
    }

    private async updateUserRoleManagerId(user_id:string,integration_token:string): Promise<IUser> {
        return await this.user_role_repository.updateManagerId(user_id,integration_token);
    }

    private async updateProfileWithComplementaryData(data: IUpdateUser) {
        return await this.create_user_service.updateProfile(data);
    }

    private async uploadDocumentsToUser(data: IUploadDocuments) {
        return await this.create_user_service.uploadDocuments(data);
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
                            translate: "auth.password.generation.title",
                            args: {
                                user_name: user.first_name as string,
                            },
                        },
                        email_password_generation_body: {
                            translate: "auth.password.generation.body",
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

export default CreateManagerService;
