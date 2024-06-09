import { Alimento } from "./alimento";

export interface Dieta {
    id?: number;
    descricao: string;
    alimentos: Alimento[];
    id_refeicao: number;
    created_at?: Date;
    updated_at?: Date;
    descricao_alimento?: string | null;
    descricao_refeicao?: string | null;
     
    
}
