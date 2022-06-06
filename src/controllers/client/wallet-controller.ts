import { Response, Request } from "express";
import { r } from "../../helpers/general";
import WalletService from "../../services/client/wallet.service";

class WalletController {
    private service: WalletService;

    constructor() {
        this.service = new WalletService();
    }

    public async getAddress(req: Request, res: Response): Promise<Response> {
        const { user_role_id } = req.auth;
        const address = await this.service.getAddress(user_role_id);
        return r(res, 'ax.wallet.address', { address });
    }

    public async getBalance(req: Request, res: Response): Promise<Response> {
        const { user_role_id } = req.auth;
        const balance = await this.service.getBalance(user_role_id);
        return r(res, '', balance);
    }
}

export default WalletController;
