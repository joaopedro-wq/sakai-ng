import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './app/guards/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'profile', loadComponent: () => import('./app/components/profile/profile.component').then(m => m.ProfileComponent) },
            { path: 'alimentos', loadChildren: () => import('./app/pages/alimentos/alimentos.routes') },
            { path: 'refeicoes', loadChildren: () => import('./app/pages/refeicoes/refeicoes.routes') },
            { path: 'metas', loadChildren: () => import('./app/pages/metas/metas.routes') },
            { path: 'dietas', loadChildren: () => import('./app/pages/dietas/dietas.routes') },
            { path: 'registros', loadChildren: () => import('./app/pages/registros/registros.routes') },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
