import { IOperationAccount } from "./operation-account";
import { IWallet } from "./wallet";

export type Transaction = {
    id: string;
    source: string;
    target: string;
    type_id: string;
    amount: number;
    user_role_id: string;
    created_at: Date;
    external_reference?: string;
    processed_at?: Date;
}

export enum TransactionEntityType {
    WALLET = "WALLET",
    OPERATION_ACCOUNT = "OPERATION_ACCOUNT",
    BINANCE_SMART_CHAIN = "BINANCE_SMART_CHAIN",
}

export type TransactionEntity = IWallet | IOperationAccount | string;
export type Source = TransactionEntity;
export type Target = TransactionEntity;