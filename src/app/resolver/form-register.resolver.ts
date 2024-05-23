import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { RegisterService } from '../service/registro.service';
import { FoodService } from '../service/alimento.service';
import { SnackService } from '../service/refeicao.service';

export const formRegisterResolver: ResolveFn<boolean> = (route, state) => {
    let registerService = inject(RegisterService);
    let foodService = inject(FoodService);
    let snackService = inject(SnackService);
    
    let id = route.params['id'];
    if (id) registerService.loadRegister(id).subscribe();
    foodService.loadFoods().subscribe();
    snackService.loadSnackies().subscribe();

    return true;
};
