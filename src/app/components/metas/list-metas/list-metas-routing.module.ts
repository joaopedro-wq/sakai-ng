import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListMetasComponent } from './list-metas.component';

import { goalResolver } from 'src/app/resolver/list-goal.resolver';

const routes: Routes = [
    {
        path: '',
        component: ListMetasComponent,
        resolve: [goalResolver],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ListMetasRoutingModule {}
