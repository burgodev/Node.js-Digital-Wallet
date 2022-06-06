import { Response, Request } from 'express';
import { paginationParams, r } from '../../helpers/general';
import TransactionRequestService from '../../services/client/transaction-request.service';

class TransactionRequestController {
    private service: TransactionRequestService;

    constructor() {
        this.service = new TransactionRequestService();
    }

    public async list(req: Request, res: Response): Promise<Response> {
        const { user_role_id } = req.auth;
        const requests = await this.service.list(user_role_id);
        return r(res, '', requests);
    }

    public async listLinkedToOA(req: Request, res: Response): Promise<Response> {
        const { user_role_id } = req.auth;
        const { take, skip } = paginationParams(req);
        const operation_account_id = req.query.operation_account_id ? req.query.operation_account_id.toString() : null;

        const history = await this.service.listLinkedToOA(user_role_id, take, skip, operation_account_id);
        return r(res, '', history);
    }

    public async listLinkedToWallet(req: Request, res: Response): Promise<Response> {
        const { user_role_id } = req.auth;
        const { take, skip } = paginationParams(req);
        const wallet_id = req.query.wallet_id ? req.query.wallet_id.toString() : null;

        const history = await this.service.listLinkedToWallet(user_role_id, take, skip, wallet_id);
        return r(res, '', history);
    }
}

export default TransactionRequestController;