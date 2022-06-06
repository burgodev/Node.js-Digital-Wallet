import { Response, Request } from 'express';
import { r } from '../../helpers/general';
import DocumentService from '../../services/admin/document.service';

class DocumentController {

    private service: DocumentService;

    constructor() {
        this.service = new DocumentService();
    }

    public async approve(req: Request, res: Response): Promise<Response> {
        const user_id = req.auth.user_id;
        const { document_id } = req.body;

        const document = await this.service.approve(user_id, document_id);
        return r(res, 'document.approved', document);
    }

    public async reprove(req: Request, res: Response): Promise<Response> {
        const user_id = req.auth.user_id;
        const { document_id, description } = req.body;

        const document = await this.service.reprove(user_id, document_id, description);
        return r(res, 'document.reproved', document);
    }

}

export default DocumentController;