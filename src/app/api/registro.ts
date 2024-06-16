import { Alimento } from "./alimento";
import { Nutrientes_totais } from "./nutrientes_totais";

export interface Registro {
    checked: boolean;
    id?: number;
    data: Date | string;
    qtd: number | [];
    alimentos: Alimento[];

    id_refeicao: number;
    id_dieta?: number;
    nutrientes_totais?: Nutrientes_totais;

   
    created_at?: Date;
    updated_at?: Date;
    descricao_alimento?: string | null;
    descricao_refeicao?: string | null;
    caloria_total?: number;
    
}
