import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { formSnackResolver } from 'src/app/resolver/form-snack.resolver';



const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./list-refeicao/list-refeicao.module').then(
                (m) => m.ListRefeicaoModule
            ),
    },
     {
        path: 'registro',
        loadChildren: () =>
            import('./form-refeicao/form-refeicao.module').then(
                (m) => m.FormRefeicaoModule
            ),
          
    },
    {
        path: 'registro/:id',
        loadChildren: () =>
            import('./form-refeicao/form-refeicao.module').then(
                (m) => m.FormRefeicaoModule
            ),
            resolve: [formSnackResolver],
    },  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RefeicaoRoutingModule {}
