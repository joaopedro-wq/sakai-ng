import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormDietaComponent } from './form-dieta.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: FormDietaComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class FormDietaRoutingModule {}
