import { DocumentStatus } from "@prisma/client";

export interface IDocument {
    id?: string;
    document_status?: DocumentStatus;
    route_url: string;
    document_type_id: string;
    user_id: string;
    uploaded_at?: string;
    validated_at?: string;
    user_validated_id?: string;
    comment?: string;
}
