
export interface Recomendacao {
    id?: number;
    get: number;
    tmb: number;
    caloria: number;
    proteina: number;
    carbo: number;
    gordura: number;

    created_at?: Date;
    updated_at?: Date;
}
