import { Response, Request } from "express";
import { r, paginationParams } from "../../helpers/general";
import TransactionHistoryService from "../../services/client/transaction-history.service";

class TransactionHistoryController {
    private service: TransactionHistoryService;

    constructor() {
        this.service = new TransactionHistoryService();
    }

    public async list(req: Request, res: Response): Promise<Response> {
        const { user_role_id } = req.auth;
        const { type } = req.query;

        const transactions = await this.service.list(user_role_id, type ? type.toString() : null);

        return r(res, "", transactions);
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

export default TransactionHistoryController;
