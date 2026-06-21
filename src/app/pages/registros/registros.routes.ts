import { Routes } from '@angular/router';

export default [
    { path: '', loadComponent: () => import('./list-registro.component').then(m => m.ListRegistroComponent) },
    { path: 'registro', loadComponent: () => import('./form-registro.component').then(m => m.FormRegistroComponent) },
    { path: 'registro/:id', loadComponent: () => import('./form-registro.component').then(m => m.FormRegistroComponent) },
] as Routes;
