import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { FoodService } from '../service/alimento.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const foodResolver: ResolveFn<boolean> = (route, state) => {
    let foodService = inject(FoodService);
    foodService.loadFoods().subscribe();

    return true;
};
