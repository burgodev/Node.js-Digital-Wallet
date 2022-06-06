import { convertToEnum } from "../../helpers/general";
import Queue from "../../helpers/queue";
import { DeviceType } from "@prisma/client";
import ValidationError from "../../errors/validation-error";
import DocumentRepository from "../../repositories/admin/document-repository";
import RejectReasonRepository from "../../repositories/admin/reject-reason-repository";
import UserRoleRepository from "../../repositories/user-role-repository";
import { IDocument } from "../../types/document";

class DocumentService {
    private repository: DocumentRepository;

    constructor() {
        this.repository = new DocumentRepository();
    }

    public async approve(user_validation_id: string, document_id: string): Promise<IDocument> {
        const doc = await this.repository.approve(user_validation_id, document_id);
        if (!doc) throw new ValidationError("document.not_found");
        
        const { user_id } = doc;
        
        await Queue.add("VerifyUserDocumentsJob", { user_id });

        return doc;
    }

    public async reprove(user_id: string, document_id: string, description: string): Promise<IDocument> {
        const reject_reason_repository = new RejectReasonRepository();
        const reject_reason = await reject_reason_repository.create(description);

        return await this.repository.reprove(user_id, document_id, reject_reason.id);
    }
}

export default DocumentService;
