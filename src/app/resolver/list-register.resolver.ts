import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { RegisterService } from '../service/registro.service';


export const registerResolver: ResolveFn<boolean> = (route, state) => {
    let registerService = inject(RegisterService);
    registerService.loadRegisters().subscribe();

    return true;
};
