import { Time } from "@angular/common";

export interface Refeicao {
    notRegistered: boolean;
    checked: boolean;
    id?: number;
    descricao: string;
    horario: string ;
    created_at?: Date;
    updated_at?: Date;
}
