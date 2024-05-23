export interface Registro {
    id?: number;
    data: Date | string;
    qtd: number | [];
    id_alimento: number | [];
    id_refeicao: number;
    created_at?: Date;
    updated_at?: Date;
    descricao_alimento?: string | null;
    descricao_refeicao?: string | null;
    caloria_total?: number;
    
}
