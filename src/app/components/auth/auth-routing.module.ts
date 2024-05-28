import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () =>
            import('./login/login.module').then((m) => m.LoginModule),
    },
    {
        path: 'register',
        loadChildren: () =>
            import('./register/register.module').then(
                (m) => m.RegisterModule
            ),
    },
    {
        path: 'password-reset/:token',
        loadChildren: () =>
            import('./newpassword/newpassword.module').then(
                (m) => m.NewPasswordModule
            ),
    },
    {
        path: 'forgotpassword',
        loadChildren: () =>
            import('./forgotpassword/forgotpassword.module').then(
                (m) => m.ForgotPasswordModule
            ),
    },
    {
        path: 'redefine-password',
        loadChildren: ()=> import('./redefine-password/redefine-password.module').then( m => m.RedefinePasswordModule),
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
