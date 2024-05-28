import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loading = false;
        this.authService.getCrsfToken().subscribe();
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
                /* next: (resp) => {
                    this.loading = false;
                    resp.first_access ? this.router.navigate(['/auth/redefine-password']) : this.router.navigate(['/']);
                }, */
                error: (error) => {
                    this.loading = false;
                    this.messageInvalid = error.message;
                }
            });
        }
    }
}
