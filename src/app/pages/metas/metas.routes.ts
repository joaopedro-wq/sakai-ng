import { Routes } from '@angular/router';

export default [
    { path: '', loadComponent: () => import('./list-metas.component').then(m => m.ListMetasComponent) },
    { path: 'registro', loadComponent: () => import('./form-metas.component').then(m => m.FormMetasComponent) },
    { path: 'registro/:id', loadComponent: () => import('./form-metas.component').then(m => m.FormMetasComponent) },
] as Routes;
