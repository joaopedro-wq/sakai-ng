import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckListComponent } from './checkList.component';
import { registerResolver } from 'src/app/resolver/list-register.resolver';

const routes: Routes = [
    {
        path: '',
        component: CheckListComponent,
        resolve: [registerResolver],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChecklistRoutingModule {}
