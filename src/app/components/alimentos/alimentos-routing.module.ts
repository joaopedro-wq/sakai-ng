import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { formFoodResolver } from 'src/app/resolver/form-food.resolver';



const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./list-alimentos/list-alimentos.module').then(
                (m) => m.ListAlimentosModule
            ),
    },
     {
        path: 'registro',
        loadChildren: () =>
            import('./form-alimentos/form-alimentos.module').then(
                (m) => m.FormAlimentosModule
            ),
          /*   resolve: [formFoodResolver], */
    },
    {
        path: 'registro/:id',
        loadChildren: () =>
            import('./form-alimentos/form-alimentos.module').then(
                (m) => m.FormAlimentosModule
            ),
            resolve: [formFoodResolver],
    },  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AlimentosRoutingModule {}
