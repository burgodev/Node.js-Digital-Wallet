import { Transaction } from "./transaction";

export type TransactionRequest = Transaction & {
    approved_at: Date;
}

export type TransactionRequestCreateDTO = Omit<TransactionRequest, "id" | "created_at" | "approved_at">;

export type TransactionRequestAdmin = {
    id: string;
    requested_at: Date;
    type: string;
    user_name: string;
    login_mt5: number;
    signature_status: string;
    robot_name: string;
    amount: number;
}