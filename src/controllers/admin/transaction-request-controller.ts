import { Response, Request } from 'express';
import { paginationParams, r } from '../../helpers/general';
import TransactionRequestService from '../../services/admin/transaction-request.service';

class TransactionRequestController {
    private service: TransactionRequestService;

    constructor() {
        this.service = new TransactionRequestService();
    }

    public async list(req: Request, res: Response): Promise<Response> {
        const { take, skip } = paginationParams(req);
        const requests = await this.service.list(take, skip);
        return r(res, '', requests);
    }

}

export default TransactionRequestController;