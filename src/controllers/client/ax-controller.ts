import { Response, Request } from 'express';
import ValidationError from '../../errors/validation-error';
import { r } from '../../helpers/general';
import TransactionService from '../../services/client/transaction.service';

class AXController {
    private service: TransactionService;

    constructor() {
        this.service = new TransactionService();        
    }

    public async proccess(req: Request, res: Response): Promise<Response> {
        const { type, idSolicitacao } = req.body;

        if (type === "deposit") {
            await this.service.deposit(req.body);
        } else if (type === "withdraw") {
            await this.service.completeWithdraw(idSolicitacao);
        } else {
            throw new ValidationError("ax.webhook.not_supported");
        }

        return r(res, '');
    }

}

export default AXController;