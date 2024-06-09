import { Alimento } from "./alimento";

export interface Registro {
    id?: number;
    data: Date | string;
    qtd: number | [];
    alimentos: Alimento[];

    id_refeicao: number;
    id_dieta?: number;

    created_at?: Date;
    updated_at?: Date;
    descricao_alimento?: string | null;
    descricao_refeicao?: string | null;
    caloria_total?: number;
    
}
