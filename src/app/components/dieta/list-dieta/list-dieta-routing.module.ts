import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDietaComponent } from './list-dieta.component';
import { registerResolver } from 'src/app/resolver/list-register.resolver';
import { dietResolver } from 'src/app/resolver/list-diet.resolver';


const routes: Routes = [
  {path: '', component: ListDietaComponent, resolve: [dietResolver]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListDietaRoutingModule {}
