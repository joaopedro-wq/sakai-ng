import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormMetasComponent } from './form-metas.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: FormMetasComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class FormMetasRoutingModule {}
