import { LEVERAGE, OPERATION_TYPE, SPREAD_TYPE } from "@prisma/client";

export interface IOperationAccount {
    id: string,

    name: string,
    balance: number,
    is_demo: boolean,
    operation_type: OPERATION_TYPE,
    spread_type: SPREAD_TYPE,
    leverage: LEVERAGE,
    account_number?: number,
    main_password: string,
    is_robot_active?: boolean,

    created_at: Date,
    updated_at: Date,
    
    user_role_id: string,
    robot_id?: string
}

export interface IOperationAccountCreateRequest {
    name: string,
    is_demo: boolean,
    operation_type: string, // METATRADER | BOTMONEY
    config?: IMetaTrader,
    balance?: number,
    is_robot_active?: boolean
}

export interface IOperationAccountCreateRepository {
    name: string,
    is_demo: boolean,
    operation_type: OPERATION_TYPE, // METATRADER | BOTMONEY
    spread_type?: SPREAD_TYPE, // RAW_SPREAD | STANDARD
    leverage?: LEVERAGE,
    balance?: number,
    metatrader_group?: string,
    account_number?: number,
    main_password: string,
    investor_password: string,

}

export interface IMetaTrader {
    spread_type: SPREAD_TYPE,
    leverage: LEVERAGE
}
/*
export interface IBotmoney {
    robot_id: string,
    origin_code: string
}*/

export interface IOperationAccountCreateRequest {
    id?: string,
    balance?: number
    metatrader_reference?: string, // TODO -rever
    operation_type: string,
    type: string,
    user_role_id: string,
    robot_id: string
}

export enum OPERATION_ACCOUNT_FILTER {
    ALL,
    JUST_ACTIVE_ROBOT,
    WITHOUT_ACTIVE_ROBOT
}