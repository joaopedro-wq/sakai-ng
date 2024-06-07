import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { profileResolver } from 'src/app/resolver/profile.resolver';


const routes: Routes = [];

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ProfileComponent,
                resolve: [profileResolver],
            },
        ]),
    ],
    exports: [RouterModule],
})
export class ProfileRoutingModule {}
