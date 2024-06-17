import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { RegisterService } from '../service/registro.service';
import { SnackService } from '../service/refeicao.service';


export const dashboardResolver: ResolveFn<boolean> = (route, state) => {
    let registerService = inject(RegisterService);
    let snackService = inject(SnackService);
    snackService.loadSnackies().subscribe();
    registerService.loadRegisters().subscribe();

    return true;
};
