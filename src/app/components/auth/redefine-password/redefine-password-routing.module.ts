import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedefinePasswordComponent } from './redefine-password.component';

const routes: Routes = [
    { path: '', component: RedefinePasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedefinePasswordRoutingModule { }
