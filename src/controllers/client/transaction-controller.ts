import { Response, Request } from "express";
import { r } from "../../helpers/general";
import TransactionService from "../../services/client/transaction.service";

class TransactionController {
    private service: TransactionService;

    constructor() {
        this.service = new TransactionService();
    }

    public async getTransactionOptions(req: Request, res: Response): Promise<Response> {
        const { user_role_id } = req.auth;
        const transaction_options = await this.service.getTransactionOptions(user_role_id);
        return r(res, "transaction.options", transaction_options);
    }

    public async deposit(req: Request, res: Response): Promise<Response> {
        await this.service.deposit(req.body);
        return r(res, '');
    }

    public async withdraw(req: Request, res: Response): Promise<Response> {
        const { user_role_id } = req.auth;
        const { amount, address } = req.body;
        await this.service.withdraw(user_role_id, amount, address);
        return r(res, '');
    }

    public async application(req: Request, res: Response): Promise<Response> {
        const { user_role_id } = req.auth;
        const { to, amount } = req.body;
        const transaction = await this.service.application(user_role_id, to, amount);
        return r(res, "transaction.application.created", transaction);
    }

    public async rescue(req: Request, res: Response): Promise<Response> {
        const { user_role_id } = req.auth;
        const { from, amount } = req.body;
        const transaction = await this.service.rescue(user_role_id, from, amount);
        return r(res, "transaction.rescue.created", transaction);
    }
}

export default TransactionController;
