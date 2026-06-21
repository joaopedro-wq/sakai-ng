import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const isLoginRequest = req.url.includes('login');

            switch(error.status){
                case 401:
                    // Não redirecionar se o próprio request de login retornou 401
                    // (credenciais inválidas), senão entraria em loop.
                    if (!isLoginRequest) {
                        this.router.navigate(['auth/login']);
                    }
                    break;
                case 302:
                    this.router.navigate(['/'])
                    break;
            }

            const message = error.error?.message || error.message || 'Erro desconhecido.';
            return throwError(() => new Error(message));
        })
        );
    }
}
