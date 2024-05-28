import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ValidatorCustomService } from 'src/app/validators/validator-custom.service';


@Component({
  selector: 'app-redefine-password',
  templateUrl: './redefine-password.component.html'
})
export class RedefinePasswordComponent implements OnInit{
    messageInvalid: string = "";
    loading: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private validatorCustomService: ValidatorCustomService
    ){}

    public formRedefinePassword: FormGroup = this.formBuilder.group({
        current_Password: ['', [Validators.required]],
        new_password: ['', [Validators.required, Validators.minLength(8)]],
        new_password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
    }, { validators: this.validatorCustomService.passwordMatchValidator('new_password', 'new_password_confirmation') });

    ngOnInit(): void {
        this.loading = false;
    }

    public sendRedefinePassword(){
        this.loading = true;
        if(this.formRedefinePassword.valid){
            this.authService.redefinePassword(this.formRedefinePassword.value).subscribe({
                next: () => {
                    this.loading = false;
                    this.router.navigate(['auth/login']);
                },
                error: (error) => {
                    this.loading = false;
                    this.messageInvalid = error.message;
                }
            });
        }
    }

}
