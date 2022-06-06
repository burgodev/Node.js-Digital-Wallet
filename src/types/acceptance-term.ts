export interface AcceptanceTerm {
    id: string;
    is_active: boolean;
    content: string;
    created_by:string;
    updated_by:string;
    deactivated_at?:Date;
    updated_at?:Date;
    acceptance_term_id:string;

}
