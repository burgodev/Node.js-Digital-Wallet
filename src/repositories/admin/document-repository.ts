import { formatDateToDB } from '../../helpers/general';
import { DocumentStatus } from '@prisma/client';
import { IDocument } from '../../types/document';
import { IDocumentType } from '../../types/document-type';
import BaseRepository from '../base-repository';

class DocumentRepository extends BaseRepository {

    protected select_arguments = {
        id: true,
        document_status: true,
        route_url: true,
        document_type_id: true,
        user_id: true,
        uploaded_at: true,
        validated_at: true,
        user_validated_id: true,
        comment: true,
    }

    constructor() {
        super();
        this.setClient(this.prisma.document);
    }

    public async approve(user_id: string, document_id: string): Promise<IDocument> {
        return await this.client.update({
            where: {
                id: document_id,
            },
            data: {
                document_status: DocumentStatus.APPROVED,
                user_validated_id: user_id,
                validated_at: formatDateToDB(new Date()),
            },
            select: this.select_arguments
        });
    }

    public async reprove(user_id: string, document_id: string, reject_reason_id: string): Promise<IDocument> {
        return await this.client.update({
            where: {
                id: document_id,
            },
            data: {
                document_status: DocumentStatus.DENIED,
                user_validated_id: user_id,
                reject_reason_id,
            },
            select: this.select_arguments
        });
    }

    public async necessaryDocuments(user_id: string): Promise<any> {
        return await this.prisma.$queryRaw`
            SELECT 
                ur.id AS user_role_id, 
                ur.role_id as role_id,
                r.name as role_name,
                docs.ids as document_types_ids
            FROM users u
            INNER JOIN user_roles ur ON ur.user_id = u.id
            INNER JOIN roles r on r.id = ur.role_id,
            LATERAL (
                SELECT array_agg(dt.id) AS ids
                FROM role_document_types rdt
                INNER JOIN document_types dt ON dt.id = rdt.document_type_id
                WHERE rdt.role_id = ur.role_id
            ) AS docs
            WHERE u.id = ${user_id}
        `;
    }

    public async getDocumentsApproved(user_id: string, document_types_ids: string[]): Promise<IDocument[]> {
        return await this.client.findMany({
            where: {
                user_id,
                document_status: DocumentStatus.APPROVED,
                document_type_id: {
                    in: document_types_ids
                }
            },
            select: this.select_arguments,
        });
    }

    // public async allDone(user_role_id: string): Promise<boolean> {
    //     `SELECT dt.name, d.validated_at FROM users u
    // INNER JOIN user_roles ur ON ur.user_id = u.id
    // INNER JOIN role_document_types rdt ON rdt.role_id = ur.role_id
    // INNER JOIN document_types dt ON dt.id = rdt.document_type_id
    // LEFT JOIN document d ON d.document_type_id = dt.id AND d.user_id = u.id AND d.document_status = 'APPROVED'
    // WHERE u.id = '984af03a-3d7a-43ef-a13b-1ee0a92b29c7'`
    // }

}

export default DocumentRepository;