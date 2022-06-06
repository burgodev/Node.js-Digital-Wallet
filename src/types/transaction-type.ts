export interface ITransactionType {
    id: string;
    name: string;
    from: string;
    to: string;
}

export enum TransactionTypeOptions {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
    APPLICATION = "application",
    RESCUE = "rescue",
    TRANSFER = "transfer",
}