import WalletService from "../services/client/wallet.service";
import { IJob } from "./index";

const CreateWalletJob: IJob = {
    key: "CreateWalletJob",
    async handle({ data }): Promise<void> {
        const { user_role_id } = data;
        const wallet_service = new WalletService();

        wallet_service.create({
            user_role_id,
        });
    },
};

export default CreateWalletJob;
