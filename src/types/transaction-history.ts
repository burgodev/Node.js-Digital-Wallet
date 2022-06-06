import { Transaction } from "./transaction";

export type TransactionHistory = Transaction;

export type TransactionHistoryCreateDTO = Omit<TransactionHistory, "id" | "created_at">;
