import { DocumentStatus } from "@prisma/client";
import { IUser } from "../../types/user";
import BaseRepository from "../base-repository";

interface ListUsers extends IUser {
    waiting_validation: number;
}

class UserRepository extends BaseRepository {
    protected select_arguments = {
        id: true,
        email: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.user);
    }

    public async list(): Promise<ListUsers[]> {
        return await this.prisma.$queryRaw`
        SELECT  
            u.first_name, 
            u.email,
            u.created_at,
            u.id,
            u.document_number,
            doc.waiting_validation,
            doc.denied,
            doc.approved
        FROM users u,
        LATERAL (
            SELECT 
                count(CASE WHEN d.document_status='WAITING_VALIDATION' THEN d.id END) AS waiting_validation,
                count(CASE WHEN d.document_status='DENIED' THEN d.id END) AS denied,
                count(CASE WHEN d.document_status='APPROVED' THEN d.id END) AS approved
            FROM document d
            WHERE  d.user_id = u.id
        ) AS doc
        `;

        // return await this.client.findMany({
        //     select: {
        //         id: true
        //     },
        //     include: {
        //         document: {
        //             select: {
        //                 _count: {
        //                     document_status: DocumentStatus.WAITING_VALIDATION
        //                 }
        //             }
        //         }
        //     }
        // });
    }

    public async listStatusWaiting() {
        return await this.prisma.$queryRaw`
        SELECT 
            user_roles.id,
            user_roles.user_id,
            user_roles.manager_id,
            user_roles.role_id,
            user_roles.status,
            users.first_name,
            users.last_name,
            users.created_at,
            users.email
        FROM user_roles 
        LEFT JOIN users ON users.id=user_roles.user_id 
        WHERE user_roles.status='WAITING'  
        `;
    }

    public async allDataOfUser(user_id: string) {
        return await this.client.findMany({
            where: {
                id: user_id,
            },
            include: {
                document: {},
                addresses: {},
            },
        });
    }

    public async getDocumentsInformation(user_id: string) {
        return await this.client.findMany({
            where: {
                id: user_id,
            },
            include: {
                document: {
                    include: {
                        document_type: {},
                    },
                },
            },
        });
    }

    public async getAddress(user_id: string) {
        return await this.client.findMany({
            where: {
                id: user_id,
            },
            include: {
                addresses: {},
            },
        });
    }
}

export default UserRepository;
