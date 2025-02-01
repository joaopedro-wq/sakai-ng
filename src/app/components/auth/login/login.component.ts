import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';


@Component({
    templateUrl: './login.component.html',
    styles: `
        .valueCenterButton{
            justify-content: center;
        }
    `
})
export class LoginComponent implements OnInit{
    rememberMe: boolean = false;
    messageInvalid: string = "";
    loading: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        public messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loading = false;
        
    }

    public formLogin: FormGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        rememberMe: [false],
    });

    public sendLogin() {
        if(this.formLogin.valid){
            this.loading = true;
            this.authService.login(this.formLogin.value).subscribe({
                error: (error) => {
                    this.loading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message
                    })
                   /*  this.messageInvalid = error.message; */
                }
            });
        }
    }


    navigateToRegister() {
        this.router.navigate([`/auth/register`]);
    }



}
