import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { RegisterService } from '../service/registro.service';
import { FoodService } from '../service/alimento.service';
import { SnackService } from '../service/refeicao.service';
import { DietService } from '../service/dieta.service';

export const formRegisterResolver: ResolveFn<boolean> = (route, state) => {
    let registerService = inject(RegisterService);
    let foodService = inject(FoodService);
    let snackService = inject(SnackService);
    let dietService = inject(DietService);

    
    let id = route.params['id'];
    if (id) registerService.loadRegister(id).subscribe();
    foodService.loadFoods().subscribe();
    snackService.loadSnackies().subscribe();
    dietService.loadDiets().subscribe();

    return true;
};
