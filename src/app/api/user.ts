export interface User {
    id?: number;
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    email_verified_at?: Date | null;
    created_at?: Date;
    updated_at?: Date;
  
}
