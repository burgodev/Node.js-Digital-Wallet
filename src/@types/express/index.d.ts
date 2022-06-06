declare namespace Express {
    export interface Request {
        auth: {
            user_id: string;
            user_role_id: string;
        }
    }
    
  }