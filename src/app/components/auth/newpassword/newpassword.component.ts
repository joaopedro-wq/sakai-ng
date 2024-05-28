import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { ValidatorCustomService } from 'src/app/validators/validator-custom.service';


@Component({
    selector: 'app-newpassword',
    templateUrl: './newpassword.component.html',
})
export class NewPasswordComponent implements OnInit {
    forcedClickLogin: boolean = false;
    loading: Boolean = false;
    messageError: string = '';
    messageSucess: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private router: Router,
        private validatorCustomService: ValidatorCustomService
    ) {}

    public passwordMatchValidator = (
        control: AbstractControl
    ): ValidationErrors | null => {
        const password = control.get('password')?.value;
        const passwordConfirmation = control.get(
            'password_confirmation'
        )?.value;
        return password === passwordConfirmation
            ? null
            : { passwordMismatch: true };
    };

    // No seu componente
    public formResetPassword: FormGroup = this.formBuilder.group(
        {
            token: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            password_confirmation: [
                '',
                [Validators.required, Validators.minLength(8)],
            ],
        },
        { validators: this.validatorCustomService.passwordMatchValidator('password', 'password_confirmation') }
    );

    ngOnInit(): void {
        this.forcedClickLogin = false;
        this.loading = false;
        this.messageError = '';
        this.messageSucess = '';

        this.activatedRoute.params.subscribe((res) =>
            this.formResetPassword.get('token')?.setValue(res['token'])
        );

        this.activatedRoute.queryParams.subscribe((res) =>
            this.formResetPassword.get('email')?.setValue(res['email'])
        );
    }

    salvar() {
        this.loading = true;
        this.authService
            .resetPassword(this.formResetPassword.value)
            .pipe(
                tap((resp) => {
                    this.forcedClickLogin = true;
                    this.messageError = '';
                    this.messageSucess = '';

                    if (resp.status) {
                        this.messageSucess = resp.message;
                    } else {
                        this.messageError = resp.message;
                    }

                    this.loading = false;
                })
            )
            .subscribe();
    }
}
