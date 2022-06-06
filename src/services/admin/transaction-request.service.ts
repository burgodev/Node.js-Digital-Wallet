import TransactionRequestRepository from "../../repositories/admin/transaction-request-repository";
import { Paginate } from "../../types/common";
import { TransactionRequestAdmin } from "../../types/transaction-request";

class TransactionRequestService {
    private repository: TransactionRequestRepository;

    constructor() {
        this.repository = new TransactionRequestRepository();
    }

    public async list(take: number, skip: number): Promise<Paginate<TransactionRequestAdmin>> {
        return await this.repository.list(take, skip);
    }

}

export default TransactionRequestService;