import { Response, Request } from 'express';
import { r } from '../../helpers/general';
import TransactionService from '../../services/admin/transaction.service';

class TransactionController {
    private service: TransactionService;

    constructor() {
        this.service = new TransactionService();
    }

    public async complete(req: Request, res: Response): Promise<Response> {
        const { transaction_request_id } = req.body;
        const history = this.service.complete(transaction_request_id);
        return r(res, 'transaction.request.complete', history);
    }

    public async cancel(req: Request, res: Response): Promise<Response> {
        const { transaction_request_id, reason } = req.body;
        const history = this.service.cancel(transaction_request_id, reason);
        return r(res, 'transaction.request.cancel', history);
    }
}

export default TransactionController;