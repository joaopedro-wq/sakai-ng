export interface Alimento {
    id?: number;
    descricao: string;
    proteina: number;
    caloria: number;
    gordura: number;
    carbo: number;
    qtd: number;
    created_at?: Date;
    updated_at?: Date;
}
