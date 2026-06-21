import { Routes } from '@angular/router';

export default [
    { path: '', loadComponent: () => import('./list-dieta.component').then(m => m.ListDietaComponent) },
    { path: 'registro', loadComponent: () => import('./form-dieta.component').then(m => m.FormDietaComponent) },
    { path: 'registro/:id', loadComponent: () => import('./form-dieta.component').then(m => m.FormDietaComponent) },
] as Routes;
