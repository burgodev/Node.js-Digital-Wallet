import { IDocumentType } from '../types/document-type';
import BaseRepository from './base-repository';

class DocumentTypeRepository extends BaseRepository {

    protected select_arguments = {
        id: true,
    }

    constructor() {
        super();
        this.setClient(this.prisma.documentType);
    }

    public async list(): Promise<IDocumentType[]> {
        return await this.client.findMany();
    }

}

export default DocumentTypeRepository;