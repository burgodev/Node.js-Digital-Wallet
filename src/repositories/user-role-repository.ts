import { UserRoleStatus } from "@prisma/client";
import { IUserRole } from "../types/user-role";
import BaseRepository from "./base-repository";
import bcrypt from "bcrypt";
import { formatDateToDB } from "../helpers/general";

class UserRoleRepository extends BaseRepository {
    protected select_arguments = {
        id: true,
        role_id: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.userRole);
    }

    public async create(
        user_id: string,
        role_id: string,
        password: string,
        manager_id?: string,
        manager_code?: string
    ): Promise<IUserRole> {
        return await this.client.create({
            data: {
                user_id,
                role_id,
                password,
                manager_id,
                manager_code,
            },
            select: this.select_arguments,
        });
    }

    public async find(user_role_id: string): Promise<IUserRole> {
        return await this.client.findUnique({
            where: {
                id: user_role_id,
            },
            select: this.select_arguments,
        });
    }

    public async listAllFromUser(user_id: string): Promise<IUserRole[]> {
        return await this.client.findMany({
            where: {
                user_id,
            },
            select: {
                ...this.select_arguments,
                password: true,
            },
        });
    }

    public async findByUserIDWithPassword(user_id: string, role_id: string): Promise<IUserRole> {
        const user_roles = await this.client.findMany({
            where: {
                user_id,
            },
            select: {
                ...this.select_arguments,
                user_id:true,
                password: true,
            },
        });
        return await user_roles.filter((user_role) => {
            return user_role.role_id == role_id;
        });
    }

    public async findByUserIDWithoutPassword(user_id: string, role_id?: string): Promise<IUserRole> {
        const user_roles = await this.client.findMany({
            where: {
                user_id: user_id,
            },
            select: {
                ...this.select_arguments,
                manager_code: true,
                manager_id: true,
                user_id: true,
                status:true
            },
        });

        const values = await user_roles.filter((user_role) => {
            return user_role.role_id == role_id;
        });
       
       return role_id? values : user_roles
    }

    public async findWithPass(user_role_id: string): Promise<IUserRole> {
        return await this.client.findUnique({
            where: {
                id: user_role_id,
            },
            select: {
                ...this.select_arguments,
                password: true,
                user_id: true,
            },
        });
    }


    public async listUsersWithRolesClientAndManager():Promise<IUserRole[]>{
        return await this.prisma.$queryRaw`
                select 
                u.first_name,
                u.last_name,
                u.email,
                u.phone_number,
                u.created_at,
                ur.user_id,
                string_agg(r.name,', ') as Roles
            from
                user_roles ur
                inner join users u on u.id = ur.user_id
                left join roles r on r.id = ur.role_id
            where 
                r.name='Client' or r.name='Manager'
            group by 
                ur.user_id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone_number,
                u.created_at     
            `        
    }

    public async getIntegrationToken(user_role_id:string):Promise<IUserRole> {
        return await this.client.findFirst({
            where: {
                id:user_role_id
            },
            select: {
                ...this.select_arguments,
                integration_token:true
            }
        })
    }
    
    public async findByIntegrationToken(integration_token: string): Promise<IUserRole> {
        return await this.client.findFirst({
            where: {
                integration_token,
            },
            select: {
                ...this.select_arguments,
                manager_id: true,
                integrated_account_id: true
            },
        });
    }

    public async findByManagerCode(manager_code: string): Promise<IUserRole> {
        return await this.client.findFirst({
            where: {
                manager_code,
            },
            select: {
                ...this.select_arguments,
                manager_id: true,
            },
        });
    }

    public async updateManagerId(user_role_id: string, manager_id: string) {
        return await this.client.update({
            where: {
                id: user_role_id,
            },
            data: {
                manager_id,
            },
        });
    }

    public async updatedStatus(user_role_id: string, status: string) {
        return await this.client.update({
            where: {
                id: user_role_id,
            },
            data: {
                status,
            },
        });
    }

    public async getUserRoles(user_id: string, role_id: string = null): Promise<IUserRole[]> {
        let where = {
            user_id,
        };

        if (role_id != null) {
            where["role_id"] = role_id;
        }

        return await this.client.findMany({
            where,
            select: {
                ...this.select_arguments,
                password: true,
            },
        });
    }

    public async findUserRolesByManager(manager_id: string) {
        const user_roles = await this.prisma.$queryRaw`
            select
                ur.role_id,
                ur.user_id,
                r.name as role_name,
                ur.integration_token,
                ur.status,
                ur.role_id,
                ur.manager_id,
                u.first_name ,
                u.email,
                u.first_name,
                u.last_name,
                u.created_at,
                u.phone_number,
                r.name,
            (
                select
                    count(ur2.id)
                from
                    user_roles ur2
                where
                    ur2.manager_id = ur.id     
            ) as quantity_total_indications,
            (
            select
                count(ur2.id)
            from 
                user_roles ur2 
            where 
                ur2.manager_id = ur.id 
                and ur2.role_id =ur.role_id
            ) as quantity_managers
        from
            user_roles ur 
            inner join users u on u.id = ur.user_id
            inner join roles r on r.id = ur.role_id
        where
            ur.manager_id = ${manager_id};

        `;

        return user_roles;
    }

    public async allIndicationsByManagers() {
        const user_roles = await this.client.findMany({
            where: {
                NOT: [{ manager_id: null }],
            },
            select: {
                ...this.select_arguments,
                integration_token: true,
                manager_id: true,
                user_id: true,
                status: true,
                role_id: true,
            },
        });
        return user_roles;
    }

    public async changePassword(user_role_id: string, password: string): Promise<void | boolean> {
        const password_hash = await this.hashPassword(password);
        if (user_role_id) {
            const response = await this.client.update({
                where: {
                    id: user_role_id,
                },
                data: {
                    password: password_hash,
                },
            });
            return true;
        }
        return false;
    }

    public async listNewUsersWithStatusWaiting() {
        return await this.prisma.$queryRaw`
        SELECT 
        user_roles.id,user_id,manager_id,role_id,status,users.first_name,users.last_name,users.email,users.email,users.created_at
        FROM user_roles
        INNER JOIN users ON users.id=user_roles.user_id  
        WHERE status='WAITING' and user_id in (
            SELECT user_id FROM user_roles 
                GROUP BY user_id
                HAVING count(user_id)=1)

        `;
    }

    public async listClientWaitingToBeManagers() {
        return await this.prisma.$queryRaw`
        SELECT 
        id,user_id,manager_id,role_id,status
        FROM user_roles
        WHERE status='WAITING' and user_id in (
        SELECT user_id FROM user_roles 
            GROUP BY user_id
            HAVING count(user_id)>1)
        `;
    }

    public async listAllWithStatusWaiting() {
        return await this.client.findMany({
            where: {
                status: "WAITING",
            },
            select: {
                ...this.select_arguments,
                integration_token: true,
                manager_id: true,
                user_id: true,
                status: true,
                role_id: true,
            },
        });
    }

    public async listManagersWaitingForValidation() {
        return await this.prisma.$queryRaw`
            SELECT  
            u.first_name, 
            u.last_name,
            u.email,
            u.created_at,
            u.id,
            u.document_number,
            doc.waiting_validation,
            doc.denied,
            doc.approved,
            rol.user_id,
            rol.role_id,
            rol.status,
            rol.id as user_role_id
        FROM users u,
        LATERAL(
        select	*
        from user_roles r
        where r.user_id = u.id
        ) as rol,
        LATERAL (
            SELECT 
                count(CASE WHEN d.document_status='WAITING_VALIDATION' THEN d.id END) AS waiting_validation,
                count(CASE WHEN d.document_status='DENIED' THEN d.id END) AS denied,
                count(CASE WHEN d.document_status='APPROVED' THEN d.id END) AS approved
            FROM document d
            WHERE  d.user_id = u.id
        ) AS doc
        `;
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(12);
        return await bcrypt.hash(password, salt);
    }

    public async userHasRole(user_id: string, role: string): Promise<boolean> {
        const user_role = await this.client.findFirst({
            where: {
                user_id,
                role: {
                    name: role,
                },
            },
            select: {
                id: true,
            },
        });

        if (user_role && user_role.id != null) return true;

        return false;
    }

    public async approve(user_role_id: string): Promise<IUserRole> {
        return await this.client.update({
            where: {
                id: user_role_id,
            },
            data: {
                status: UserRoleStatus.ACTIVE,
            },
            select: this.select_arguments,
        });
    }

    public async updateMetatraderClientId(user_role_id: string, metatrader_client_id: number): Promise<IUserRole> {
        const ret = await this.client.update({
            where: {
                id: user_role_id,
            },
            data: {
                metatrader_client_id,
            },
            select: this.select_arguments,
        });

        return ret;
    }

    public async getById(user_role_id: string) {
        const ret = await this.client.findFirst({
            where: {
                id: user_role_id
            },
            select:  { ...this.select_arguments, integration_token: true }
        });

        return ret;
    }

    public async updateIntegratedAccount(user_role_id:string, botmoney_user_id: string) {
        await this.client.update({
            where: {
                id: user_role_id
            },
            data: {
                integrated_account_id: botmoney_user_id,
                integrated_at: formatDateToDB(new Date())
            }
        });
    }

}

export default UserRoleRepository;
