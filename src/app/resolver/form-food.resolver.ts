import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { FoodService } from '../service/alimento.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const formFoodResolver: ResolveFn<boolean> = (route, state) => {
    let foodService = inject(FoodService);
    let id = route.params['id'];
    foodService.loadFood(id).subscribe();

    return true;
};
