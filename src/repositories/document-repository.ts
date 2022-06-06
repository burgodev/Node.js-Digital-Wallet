import { IDocument } from '../types/document';
import BaseRepository from './base-repository';

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

    public async create(data: IDocument): Promise<IDocument> {
        return await this.client.create({
            data,
            select: this.select_arguments,
        });
    }

    public async update(id: string, data: IDocument): Promise<IDocument> {
        return await this.client.update({
            where: {
                id,
            },
            data,
            select: this.select_arguments,
        });
    }

    public async getUserDocuments(user_id: string): Promise<IDocument[]> {

        return await this.prisma.$queryRaw`
            SELECT 
                dt.id AS document_type_id,
                dt.name,
                d.id,
                d.document_status,
                d.route_url,
                d.uploaded_at,
                d.validated_at,
                d.user_validated_id,
                d.comment
            FROM document_types dt 
            LEFT JOIN document d ON d.document_type_id = dt.id AND d.user_id = ${user_id}
        `;
    }

    public async getUserDocument(user_id: string, document_type_id: string): Promise<IDocument> {
        return await this.client.findFirst({
            where: {
                user_id,
                document_type_id,
            },
            select: this.select_arguments,
        });
    }

}

export default DocumentRepository;