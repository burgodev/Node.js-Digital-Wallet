export interface IWallet {
    id?: string;
    address: string;
    private_key?: string;
    balance: number;
    user_role_id: string;
}

export type Wallet = {
    id: string;
    address: string;
    private_key?: string;
    balance: number;
    user_role_id: string;
    created_at: Date;
}

export type WalletCreateDTO = Omit<Wallet, 'id'>

export type WalletUpdateDTO = Partial<WalletCreateDTO>