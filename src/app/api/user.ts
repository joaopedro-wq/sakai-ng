export interface User {
    id?: number;
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    email_verified_at?: Date | null;
    created_at?: Date;
    updated_at?: Date;
    data_nascimento: Date | string;
    avatar?: string | null;
    nivel_atividade?: string | null;
    genero?: string | null;
    altura?: number | null;
    peso?: number | null;
}
