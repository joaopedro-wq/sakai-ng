import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardRelatorioComponent } from './dashboard-relatorio.component';
import { registerResolver } from 'src/app/resolver/list-register.resolver';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: DashboardRelatorioComponent,
                resolve: [registerResolver]
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DashboardRelatoriooRoutingModule {}
