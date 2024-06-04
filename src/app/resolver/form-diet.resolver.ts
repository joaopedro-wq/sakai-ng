import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { FoodService } from '../service/alimento.service';
import { SnackService } from '../service/refeicao.service';
import { DietService } from '../service/dieta.service';

export const formDietResolver: ResolveFn<boolean> = (route, state) => {
    let dietService = inject(DietService);
    let foodService = inject(FoodService);
    let snackService = inject(SnackService);
    
    let id = route.params['id'];
    if (id) dietService.loadDiet(id).subscribe();
    foodService.loadFoods().subscribe();
    snackService.loadSnackies().subscribe();

    return true;
};
