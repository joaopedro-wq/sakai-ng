import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormAlimentosComponent } from './form-alimentos.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: FormAlimentosComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class FormAlimentosRoutingModule {}
