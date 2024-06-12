import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { RegisterService } from '../service/registro.service';
import { GoalService } from '../service/metas.service';


export const goalResolver: ResolveFn<boolean> = (route, state) => {
    let registerService = inject(RegisterService);
    let goalService = inject(GoalService);

    registerService.loadRegisters().subscribe();
    goalService.loadGoals().subscribe();


    return true;
};
