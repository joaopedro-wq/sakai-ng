import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated) {
        return true;
    }

    return authService.getLoggedUserWithToken().pipe(
        map(() => {
            authService.setAuthenticated(true);
            return true;
        }),
        catchError(() => of(router.createUrlTree(['/auth/login'])))
    );
};
