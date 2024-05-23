import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { SnackService } from '../service/refeicao.service';


export const formSnackResolver: ResolveFn<boolean> = (route, state) => {
    let snackService = inject(SnackService);
    let id = route.params['id'];
    snackService.loadSnack(id).subscribe();

    return true;
};
