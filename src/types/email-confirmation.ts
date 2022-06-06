export interface EmailConfirmation {
    id?: string;
    user_id: string;
    email: string;
    requested_at: Date;
    token: string;
}