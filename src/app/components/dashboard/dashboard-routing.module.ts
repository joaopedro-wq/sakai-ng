import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';




const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./dashboard/checkList.module').then(
                (m) => m.CheckListModule
            ),
            
    },
    
     
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardsRoutingModule {}
