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

            switch(error.status){
                case 401:
                    this.router.navigate(['auth/login'])
                    break;
                case 302:
                    this.router.navigate(['/'])
                    break;
            }

            return throwError(() => new Error(error.error.message || error.message));
        })
        );
    }
}
