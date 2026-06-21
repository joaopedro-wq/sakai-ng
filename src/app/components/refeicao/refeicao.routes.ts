import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('./list-refeicao.component').then(m => m.ListRefeicaoComponent)
    },
    {
        path: 'registro',
        loadComponent: () => import('./form-refeicao.component').then(m => m.FormRefeicaoComponent)
    },
    {
        path: 'registro/:id',
        loadComponent: () => import('./form-refeicao.component').then(m => m.FormRefeicaoComponent)
    }
] as Routes;
