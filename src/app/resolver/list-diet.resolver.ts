import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { DietService } from '../service/dieta.service';


export const dietResolver: ResolveFn<boolean> = (route, state) => {
    let dietService = inject(DietService);
    dietService.loadDiets().subscribe();

    return true;
};
