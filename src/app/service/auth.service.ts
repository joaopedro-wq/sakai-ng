import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { HttpPersonService } from './http-person.service';
import { User } from '../api/user';
import { ResetPassword } from '../api/reset-password';
import { RedefinePassword } from '../api/redefine-password';
import { Login } from '../api/login';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public loggedUser?: User;
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    obsGetLoggedUser: EventEmitter<User> = new EventEmitter();

    constructor(private router: Router, private http: HttpPersonService) {}

    getCrsfToken(){
        return this.http.get('sanctum/csrf-cookie')
    }

    login(formLogin: Login): Observable<any> {
        return this.http.post('login', formLogin).pipe( tap((res: any) => {
            // Executa uma ação quando a requisição for bem-sucedida
                this.router.navigate(['/']);
        }),
            catchError(error => {
                const errorMessage = error?.message || 'Erro desconhecido';
                this.router.navigate(['/auth/login']);
                return throwError(() => new Error(errorMessage));
              })
        );
    }

    logout(): Observable<any> {
        return this.http.post('logout', {}).pipe(
            tap(() => {
                this.isAuthenticatedSubject.next(false);
                this.router.navigate(['/auth/login']);
            }),
            catchError((error: any) => {
                return throwError(() => new Error(error));
            })
        );
    }

    forgotPassword(value: string): Observable<any>{
        return this.http.post('forgot-password', {email: value}).pipe(
            catchError((error: any) => {
                return throwError(() => new Error(error));
            })
        );
    }

    resetPassword(params: ResetPassword): Observable<any>{
        return this.http.post('reset-password', params).pipe(
            catchError((error: any) => {
                return throwError(() => new Error(error));
            })
        );
    }

    redefinePassword(params: RedefinePassword): Observable<any>{
        return this.http.post('api/redefine-password', params).pipe(
            catchError((error: any) => {
                return throwError(() => new Error(error));
            })
        );
    }

    getLoggedUserWithToken(): Observable<any> {
        console.log('toooo')
        return this.http.get('/api/user/get-with-token').pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                if (res.success) {
                    this.loggedUser = res.data;
                    this.obsGetLoggedUser.emit(this.loggedUser);
                }
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }
}
