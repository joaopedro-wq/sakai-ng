import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { catchError, tap } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';


@Component({
    templateUrl: './forgotpassword.component.html',
    styles: `
        .textSucess { color: #00b604}
        .textError { color: #ee0f0f}
    `
})
export class ForgotPasswordComponent  {

    email = new FormControl('', [Validators.required, Validators.email]);
    messageSucess: string = "";
    messageError: string = "";
    loading: boolean = false;

    constructor( private authService: AuthService ){}

    public enviarEmail(){
        this.loading = true;
        if(this.email.valid && this.email.value){
            this.authService.forgotPassword(this.email.value).pipe(
                tap((resp) => {
                    this.messageSucess = "";
                    this.messageError = "";

                    if(resp.status)
                        this.messageSucess = resp.message;
                    else
                        this.messageError = resp.message;

                    this.loading = false;
                })
            ).subscribe();
        }
    }
}
