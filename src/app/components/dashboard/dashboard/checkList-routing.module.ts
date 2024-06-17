import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckListComponent } from './checkList.component';
import { dashboardResolver } from 'src/app/resolver/list-dashboard.resolver';

const routes: Routes = [
    {
        path: '',
        component: CheckListComponent,
        resolve: [dashboardResolver],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChecklistRoutingModule {}
