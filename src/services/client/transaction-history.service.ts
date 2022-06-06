import TransactionTypeRepository from "../../repositories/client/transaction-type-repository";
import { TransactionHistory } from "../../types/transaction-history";
import TransactionHistoryRepository from "../../repositories/client/transaction-history-repository";
import ValidationError from "../../errors/validation-error";
import { Paginate } from "../../types/common";

class TransactionHistoryService {
    private repository: TransactionHistoryRepository;

    constructor() {
        this.repository = new TransactionHistoryRepository();
    }

    public async list(user_role_id, type: string = null): Promise<TransactionHistory[]> {
        if (type != null) {
            const transaction_type = await new TransactionTypeRepository().getByName(type);
            if (!transaction_type) throw new ValidationError("transaction.type.not_found");
            type = transaction_type.id;
        }

        return await this.repository.list(user_role_id, type);
    }

    public async validate(external_reference: string): Promise<boolean> {
        const transaction_history = await this.repository.findByExternalReference(external_reference);
        return !transaction_history;
    }

    public async listLinkedToOA(user_role_id: string, take: number, skip: number, operation_account_id: string = null): Promise<Paginate<TransactionHistory>> {
        const types = await new TransactionTypeRepository().getIDsLinkedToOperationAccount();
        return await this.repository.listLinked(user_role_id, take, skip, types, operation_account_id);
    }

    public async listLinkedToWallet(user_role_id: string, take: number, skip: number, wallet_id: string = null): Promise<Paginate<TransactionHistory>> {
        const types = await new TransactionTypeRepository().getIDsLinkedToWallet();
        return await this.repository.listLinked(user_role_id, take, skip, types, wallet_id);
    }
}

export default TransactionHistoryService;
