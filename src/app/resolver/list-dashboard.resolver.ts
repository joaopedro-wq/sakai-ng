import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { RegisterService } from '../service/registro.service';
import { SnackService } from '../service/refeicao.service';
import { GoalService } from '../service/metas.service';
import { AuthService } from '../service/auth.service';


export const dashboardResolver: ResolveFn<boolean> = (route, state) => {
    let registerService = inject(RegisterService);
    let snackService = inject(SnackService);
     let goalService = inject(GoalService);
     let authService = inject(AuthService);
     authService.getLoggedUserWithToken().subscribe();
  
    goalService.loadGoals().subscribe();
    snackService.loadSnackies().subscribe();
    registerService.loadRegisters().subscribe();

    return true;
};
