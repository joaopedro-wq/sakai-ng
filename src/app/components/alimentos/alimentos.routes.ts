import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('./list-alimentos.component').then(m => m.ListAlimentosComponent)
    },
    {
        path: 'registro',
        loadComponent: () => import('./form-alimentos.component').then(m => m.FormAlimentosComponent)
    },
    {
        path: 'registro/:id',
        loadComponent: () => import('./form-alimentos.component').then(m => m.FormAlimentosComponent)
    }
] as Routes;
