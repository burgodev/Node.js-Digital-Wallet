import AXApi from "../../helpers/ax-api";
import APIError from "../../errors/api-error";
import { l } from "../../helpers/general";

export const withdraw_wallet_address = "0x8e9EE0EA93c87F0BF009012E718b8447A46428F3";

class AXService {
    constructor() {}

    public async generateWallet(wallet_id: string): Promise<string> {
        const { data } = await AXApi.post("/Integracao/GerarWallet", { integracaoId: wallet_id });

        if (!data.success) throw new APIError("ax.error.wallet");
        return data.data;
    }

    public async withdraw(address: string, amount: number): Promise<string> {
        try {
            const { data } = await AXApi.post("/Integracao/GerarSaque", {
                payOuts: [{ endereco: address, valor: amount }],
            });
    
            return data[0];    
        } catch (error) {
            l.error("ax.withdraw.error", { message: error.message });
            throw new APIError("ax.withdraw.error");
        }
    }
}

export default AXService;
