import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { formFoodResolver } from 'src/app/resolver/form-food.resolver';
import { formRegisterResolver } from 'src/app/resolver/form-register.resolver';



const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./list-registro/list-registros.module').then(
                (m) => m.ListRegistroModule
            ),
            
    },
    {
        path: 'registro',
        loadChildren: () =>
            import('./form-registro/form-registro.module').then(
                (m) => m.FormRegistroModule
            ),
            resolve: [formRegisterResolver],
            
    },
    {
        path: 'registro/:id',
        loadChildren: () =>
            import('./form-registro/form-registro.module').then(
                (m) => m.FormRegistroModule
            ),
            resolve: [formRegisterResolver],

    },
     
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RegistroRoutingModule {}
