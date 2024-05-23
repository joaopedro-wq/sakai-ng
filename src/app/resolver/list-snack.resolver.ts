import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { SnackService } from '../service/refeicao.service';


export const snackResolver: ResolveFn<boolean> = (route, state) => {
    let snackService = inject(SnackService);
    snackService.loadSnackies().subscribe();

    return true;
};
