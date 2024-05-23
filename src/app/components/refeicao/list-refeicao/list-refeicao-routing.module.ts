import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRefeicaoComponent } from './list-refeicao.component';
import { snackResolver } from 'src/app/resolver/list-snack.resolver';


const routes: Routes = [
    { path: '', component: ListRefeicaoComponent, resolve: [snackResolver] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ListRefeicaoRoutingModule {}
