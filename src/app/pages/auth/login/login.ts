import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../../service/auth.service';
import { AuthCardComponent } from '../components/auth-card.component';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        AuthCardComponent,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        MessageModule,
        PasswordModule,
        ReactiveFormsModule,
        RouterModule,
        RippleModule
    ],
    templateUrl: './login.html'
})
export class Login {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);

    loading = signal(false);
    errorMessage = signal<string | null>(null);
    currentYear = new Date().getFullYear();


    form = this.fb.group({
        email:      ['', [Validators.required, Validators.email]],
        password:   ['', [Validators.required, Validators.minLength(6)]],
        rememberMe: [false]
    });

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        this.errorMessage.set(null);

        const { email, password, rememberMe } = this.form.getRawValue();

        this.authService.login({ email: email!, password: password!, rememberMe: rememberMe! })
            .subscribe({
                error: (err: Error) => {
                    this.loading.set(false);
                    this.errorMessage.set(err.message || 'Credenciais invalidas. Tente novamente.');
                },
                complete: () => {
                    this.loading.set(false);
                }
            });
    }
}
