import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { formFoodResolver } from 'src/app/resolver/form-food.resolver';
import { formRegisterResolver } from 'src/app/resolver/form-register.resolver';



const routes: Routes = [
   
    {
        path: '',
        loadChildren: () =>
            import('./relatorio/dashboard-relatorio.module').then(
                (m) => m.DashboardRelatorioModule
            ),
            resolve: [formRegisterResolver],
            
    },
    {
        path: 'registro/:id',
        loadChildren: () =>
            import('./relatorio/dashboard-relatorio.module').then(
                (m) => m.DashboardRelatorioModule
            ),
            resolve: [formRegisterResolver],

    },
     
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RelatorioRoutingModule {}
