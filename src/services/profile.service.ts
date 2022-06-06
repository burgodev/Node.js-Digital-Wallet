import bcrypt from "bcrypt";
import UnauthenticatedError from "../errors/unauthenticated-error";
import ValidationError from "../errors/validation-error";
import AddressRepository from "../repositories/address-repository";
import DocumentRepository from "../repositories/document-repository";
import UserRepository from "../repositories/user-repository";
import UserRoleRepository from "../repositories/user-role-repository";
import { IAddress } from "../types/address";
import { IDocument } from "../types/document";
import { DocumentUploaded, IUpdateUser, IUploadDocuments, IUser } from "../types/user";
import UserRoleService from "./user-role.service";

class ProfileService {
    constructor() {}

    public async getData(user_id: string): Promise<IUser> {
        const user_repository = new UserRepository();
        return await user_repository.find(user_id);
    }

    public async getDocuments(user_id: string): Promise<IDocument[]> {
        const document_repository = new DocumentRepository();
        return await document_repository.getUserDocuments(user_id);
    }

    public async changePassword(user_role_id: string, old_password: string, password: string): Promise<boolean> {
        const user_role_repository = new UserRoleRepository();
        const user_role = await user_role_repository.findWithPass(user_role_id);

        if (!user_role) throw new UnauthenticatedError();

        const pass_valid = await bcrypt.compare(old_password, user_role.password);
        if (!pass_valid) throw new ValidationError("user.profile.change_password.invalid");

        await new UserRoleService().changePassword(user_role_id, password);

        return true;
    }

    public async update(user_id: string, data: IUpdateUser): Promise<IUser> {
        const user_repository = new UserRepository();
        const user = await user_repository.update(user_id, data);

        return user;
    }

    public async updateAddress(user_id: string, data: IAddress): Promise<IAddress> {
        const address_repository = new AddressRepository();
        const address = await address_repository.getUserAddres(user_id);

        const address_to_save = {
            user_id,
            ...data,
        };

        if (address) {
            return await address_repository.update(address.id, { ...address, ...address_to_save });
        } else {
            return await address_repository.create(address_to_save);
        }
    }

    public async uploadDocuments(user_id: string, documents: DocumentUploaded[]): Promise<Boolean> {
        const document_repository = new DocumentRepository();
        const countNumber = documents.length;
        let counter = 0;

        if (countNumber === 0) return false;

        for (let doc of documents) {
            const document = await document_repository.getUserDocument(user_id, doc.type);

            const doc_obj = {
                user_id,
                route_url: doc.url,
                document_type_id: doc.type,
            };

            if (document) {
                await document_repository.update(document.id, doc_obj);
                counter += 1;
            } else {
                await document_repository.create(doc_obj);
                counter += 1;
            }
        }

        const verification = countNumber === counter ? true : false;

        return verification;
    }

    public async getIntegrationToken(user_role_id:string):Promise<string> {
        const user_role_repository = new UserRoleRepository();
        const user_role = await user_role_repository.getIntegrationToken(user_role_id);

        return user_role.integration_token
    }
}

export default ProfileService;
