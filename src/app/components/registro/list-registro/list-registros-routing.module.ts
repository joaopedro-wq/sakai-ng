import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRegistrosComponent } from './list-registros.component';
import { registerResolver } from 'src/app/resolver/list-register.resolver';

const routes: Routes = [
    { path: '', component: ListRegistrosComponent, resolve: [registerResolver] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LisRegistroRoutingModule {}
