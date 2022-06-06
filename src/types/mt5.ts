/*export interface IClientCreateReturn {
    id: number;
    retcode: string;
}*/


export interface IMt5UserCreate {
    externalId: string, // id da select
    name: string, // nome do titular
    lastName: string, // ultimo nome do titular
    type: number, // [1] type do user. pode ser user (type=1), ou manager (type=2)
    status: number, // [700] - status de que a conta pode começar a operar (documentos validados)
    assignedManager: number // [1173] - conta manager com web api habilitada
}

export interface IMt5User {
    id: string, // id mt5
    externalId: string,
    name: string,
    lastName: string,
    type: number,
    status: number,
    assignedManager: number,
    mt5ID: number // usuário id do metatrader
}

export interface IMt5OperationAccountCreate {
    passMain: string,
    passInvestor: string,
    group: string,
    name: string,
    leverage: number,
    mt5Id: number //metatrader client id
}

export interface IMt5OperationAccount {
    id: string, // id da mt5
    login: string, // account number - mostrar pro usuário
    passMain: string, // mostrar - pro usuário?
    passInvestor: string,
    group: string,
    name: string,
    leverage: number,
    ownerid: number //mt5 id do user proprietário
}

export interface IMt5OperationAccountUpdatePassword {
    type: string, // investor | main
    password: string
}

export interface IMt5OperationAccountUpdateBalance {
    type: number, // 2 - balance, 3 - credit
    balance: number, // valor incrementado
    comment: string
}

//balance - udsx saldo
//credit - 