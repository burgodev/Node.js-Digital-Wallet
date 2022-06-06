import { Response, Request } from 'express';
import { r } from '../helpers/general';
import DocumentTypeService from '../services/document-type.service';

class DocumentTypeController {

    private service: DocumentTypeService;

    constructor() {
        this.service = new DocumentTypeService();
    }

    public async list(req: Request, res: Response): Promise<Response> {
        const document_types = await this.service.list();
        return r(res, '', document_types);
    }

}

export default DocumentTypeController;