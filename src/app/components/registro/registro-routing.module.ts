import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { formFoodResolver } from 'src/app/resolver/form-food.resolver';



const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./form-registro/form-registro.module').then(
                (m) => m.FormRegistroModule
            ),
    },
     
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RegistroRoutingModule {}
