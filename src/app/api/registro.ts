export interface Registro {
    id?: number;
    descricao: string;
    data: Date | string;
    qtd: number;
    id_alimento?: number;
    created_at?: Date;
    updated_at?: Date;
    descricao_alimento?: string | null;

}
