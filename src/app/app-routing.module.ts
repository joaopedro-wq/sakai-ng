import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';


@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: '',
                            loadChildren: () =>
                                import(
                                    './demo/components/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule),
                        },
                        {
                            path: 'refeicoes',
                            data: { breadcrumb: 'Refeição' },
                            loadChildren: () =>
                                import(
                                    './components/refeicao/refeicao.module'
                                ).then((m) => m.RefeicaoModule),
                        },
                        {
                            path: 'dietas',
                            data: { breadcrumb: 'Dieta' },
                            loadChildren: () =>
                                import(
                                    './components/dieta/dieta.module'
                                ).then((m) => m.DietaModule),
                        },
                        
                        {
                            path: 'alimentos',
                            data: { breadcrumb: 'Alimentos' },
                            loadChildren: () =>
                                import(
                                    './components/alimentos/alimentos.module'
                                ).then((m) => m.AlimentosModule),
                        },
                        {
                            path: 'registros',
                            data: { breadcrumb: 'Registro Diario' },
                            loadChildren: () =>
                                import(
                                    './components/registro/registro.module'
                                ).then((m) => m.RegistroModule),
                        },
                        {
                            path: 'relatorio',
                            data: { breadcrumb: 'Relatório' },
                            loadChildren: () =>
                                import(
                                    './components/relatorio/relatorio.module'
                                ).then((m) => m.RelatorioModule),
                        },

                        {
                            path: 'profile',
                            data: { breadcrumb: 'Perfil' },
                            loadChildren: () =>
                                import('./components/profile/profile.module').then(
                                    (m) => m.ProfileModule
                                ),
                        },
                        
                    ],
                    
                },
                {
                    path: 'auth',
                    loadChildren: () =>
                        import('./components/auth/auth.module').then(
                            (m) => m.AuthModule
                        ),
                         /* canActivate: [unauthGuard], */ 
                },
                
                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
