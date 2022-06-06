import TransactionRequestRepository from "../../repositories/client/transaction-request-repository";
import TransactionTypeRepository from "../../repositories/client/transaction-type-repository";
import { Paginate } from "../../types/common";
import { TransactionRequest } from "../../types/transaction-request";

class TransactionRequestService {
    private repository: TransactionRequestRepository;

    constructor() {
        this.repository = new TransactionRequestRepository();
    }

    public async list(user_role_id: string): Promise<TransactionRequest[]> {
        return await this.repository.list(user_role_id);
    }

    public async listLinkedToOA(user_role_id: string, take: number, skip: number, operation_account_id: string = null): Promise<Paginate<TransactionRequest>> {
        const types = await new TransactionTypeRepository().getIDsLinkedToOperationAccount();
        return await this.repository.listLinked(user_role_id, take, skip, types, operation_account_id);
    }

    public async listLinkedToWallet(user_role_id: string, take: number, skip: number, wallet_id: string = null): Promise<Paginate<TransactionRequest>> {
        const types = await new TransactionTypeRepository().getIDsLinkedToWallet();
        return await this.repository.listLinked(user_role_id, take, skip, types, wallet_id);
    }
}

export default TransactionRequestService;