enum TransactionEntity {
    WALLET = "WALLET",
    OPERATION_ACCOUNT = "OPERATION_ACCOUNT",
    BINANCE_SMART_CHAIN = "BINANCE_SMART_CHAIN",
}

export const transaction_types = [
    {
        name: "deposit",
        from: TransactionEntity.BINANCE_SMART_CHAIN,
        to: TransactionEntity.WALLET,
    },
    {
        name: "withdraw",
        from: TransactionEntity.WALLET,
        to: TransactionEntity.BINANCE_SMART_CHAIN,
    },
    {
        name: "application",
        from: TransactionEntity.WALLET,
        to: TransactionEntity.OPERATION_ACCOUNT,
    },
    {
        name: "rescue",
        from: TransactionEntity.OPERATION_ACCOUNT,
        to: TransactionEntity.WALLET,
    },
    {
        name: "transfer",
        from: TransactionEntity.OPERATION_ACCOUNT,
        to: TransactionEntity.OPERATION_ACCOUNT,
    },
];