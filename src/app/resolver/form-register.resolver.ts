import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { RegisterService } from '../service/registro.service';
import { FoodService } from '../service/alimento.service';

export const formRegisterResolver: ResolveFn<boolean> = (route, state) => {
    let registerService = inject(RegisterService);
    let foodService = inject(FoodService);
    
    let id = route.params['id'];
    if (id) registerService.loadRegister(id).subscribe();
    foodService.loadFoods().subscribe();
    return true;
};
