import { IAddress } from "./address";

export interface IUser {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    email_checked_at?: Date;
}

export type DocumentUploaded = {
    type: string;
    url: string;
};

export interface ICreateUser {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    nationality_id: string;
    role: string;
    manager_code?:string;
}

export interface IUpdateUser {
    email?: string;
    user_id?: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    phone_number: string;
    document_number: string;
    address: IAddress;
}

export interface IUploadDocuments {
    email?: string;
    user_id?: string;
    documents: DocumentUploaded[];
}
export interface ICreateManager {
    first_name: string;
    user_id?: string;
    last_name: string;
    email: string;
    nationality_id: string;
    role: string;
    birth_date: string;
    document_number: string;
    phone_number: string;
    address: IAddress;
    documents: DocumentUploaded[];
    acceptance_term_id: string;
    accepted: boolean;
    date:Date;
    integration_token?:string;
    manager_code?:string
}

export interface AcceptanceTerms {
    accepted: boolean;
    user_id: string;
    acceptance_term_id: string;
    date:Date;
}
