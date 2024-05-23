import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormRefeicaoComponent } from './form-refeicao.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: FormRefeicaoComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class FormRefeicaoRoutingModule {}
