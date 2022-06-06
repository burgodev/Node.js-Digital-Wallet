import { l } from "../helpers/general";
import Queue from "../helpers/queue";
import DocumentRepository from "../repositories/admin/document-repository";
import UserRoleRepository from "../repositories/user-role-repository";
import { IJob } from "./index";
import CommercialService from "../services/commercial.service"

const VerifyUserDocumentsJob: IJob = {
    
    key: "VerifyUserDocumentsJob",
    async handle({ data }): Promise<void> {
        const { user_id } = data;
        const document_repository = new DocumentRepository();
        const roles_necessary_documents = await document_repository.necessaryDocuments(user_id);

        for (let role of roles_necessary_documents) {
            if (role.document_types_ids == null) continue;
            const documents_approved = await document_repository.getDocumentsApproved(user_id, role.document_types_ids);

            if (role.document_types_ids.length == documents_approved.length) {
                const user_role_repository = new UserRoleRepository();
                user_role_repository.approve(role.user_role_id);
                l.info("User role approved", { user_role_id: role.user_role_id });

                if (role.role_name == "Manager") {
                    new CommercialService().activeSolicitationToManager(user_id)
                }

                if (role.role_name == "Client") {
                    user_role_repository.approve(role.user_role_id);
                    await Queue.add("CreateWalletJob", { user_role_id: role.user_role_id });
                }
            }
        }
    },
};

export default VerifyUserDocumentsJob;
