import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { formGoalResolver } from 'src/app/resolver/form-goal.resolver';




const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./list-metas/list-metas.module').then(
                (m) => m.ListMetasModule
            ),
            
    },
    {
        path: 'registro',
        loadChildren: () =>
            import('./form-metas/form-metas.module').then(
                (m) => m.FormMetasModule
            ),
            resolve: [formGoalResolver],
            
    },
    {
        path: 'registro/:id',
        loadChildren: () =>
            import('./form-metas/form-metas.module').then(
                (m) => m.FormMetasModule
            ),
            resolve: [formGoalResolver],

    },
     
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MetasRoutingModule {}
