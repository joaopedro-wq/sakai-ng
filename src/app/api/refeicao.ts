import { Time } from "@angular/common";

export interface Refeicao {
    id?: number;
    descricao: string;
    horario: Date |  string;
    created_at?: Date;
    updated_at?: Date;
}
