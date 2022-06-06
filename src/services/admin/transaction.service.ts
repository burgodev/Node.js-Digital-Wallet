import TransactionRepository from "../../repositories/client/transaction-repository";
import { TransactionHistory } from "../../types/transaction-history";
import { TransactionRequest } from "../../types/transaction-request";

class TransactionService {
    private repository: TransactionRepository;

    constructor() {
        this.repository = new TransactionRepository();
    }

    public async complete(transaction_request_id: string): Promise<TransactionHistory> {
        return await this.repository.completeRequest(transaction_request_id);
    }

    public async cancel(transaction_request_id: string, reason: string): Promise<TransactionRequest> {
        return await this.repository.cancelRequest(transaction_request_id, reason);
    }

}

export default TransactionService;