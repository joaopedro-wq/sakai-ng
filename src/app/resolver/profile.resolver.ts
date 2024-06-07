import { ResolveFn } from '@angular/router';

import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

export const profileResolver: ResolveFn<boolean> = (route, state) => {
    let authService = inject(AuthService);
    authService.getLoggedUserWithToken().subscribe();
    return true;
};
