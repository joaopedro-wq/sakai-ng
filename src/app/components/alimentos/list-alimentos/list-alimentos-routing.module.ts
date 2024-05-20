import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAlimentosComponent } from './list-alimentos.component';
import { foodResolver } from 'src/app/resolver/list-food.resolver';
/* 
const routes: Routes = [
    {path: '', component: ListAlimentosComponent, resolve: [foodResolver]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class ListAlimentosRoutingModule {}
 */

const routes: Routes = [
  {path: '', component: ListAlimentosComponent, resolve: [foodResolver]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListAlimentosRoutingModule {}
