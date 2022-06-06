import DocumentTypeRepository from "../repositories/document-type-repository";
import { IDocumentType } from "../types/document-type";

class DocumentTypeService {
    private repository: DocumentTypeRepository;

    constructor() {
        this.repository = new DocumentTypeRepository();
    }

    public async list(): Promise<IDocumentType[]> {
        return await this.repository.list();
    }
}

export default DocumentTypeService;
