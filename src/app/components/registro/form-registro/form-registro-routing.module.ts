import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormRegistroComponent } from './form-registro.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: FormRegistroComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class FormRegistroRoutingModule {}
