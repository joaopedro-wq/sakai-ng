import { ResolveFn } from '@angular/router';

import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { NutritionService } from '../service/recomendacao.service';

export const profileResolver: ResolveFn<boolean> = (route, state) => {
    let authService = inject(AuthService);
    let nutritionService = inject(NutritionService);


    authService.getLoggedUserWithToken().subscribe();
    nutritionService.loadNutritions().subscribe();

    
    return true;
};
