import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { formDietResolver } from 'src/app/resolver/form-diet.resolver';




const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./list-dieta/list-dieta.module').then(
                (m) => m.ListDietaModule
            ),
    },
     {
        path: 'registro',
        loadChildren: () =>
            import('./form-dieta/form-dieta.module').then(
                (m) => m.FormDietaModule
            ),
            resolve: [formDietResolver],

         
    },
    {
        path: 'registro/:id',
        loadChildren: () =>
            import('./form-dieta/form-dieta.module').then(
                (m) => m.FormDietaModule
            ),
            resolve: [formDietResolver],
    },  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DietaRoutingModule {}
