import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../service/auth.service';
import { AuthCardComponent } from '../components/auth-card.component';


const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmation = group.get('password_confirmation')?.value;
    return password && confirmation && password !== confirmation ? { passwordMismatch: true } : null;
};

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        AuthCardComponent,
        ButtonModule,
        DatePickerModule,
        InputTextModule,
        MessageModule,
        PasswordModule,
        ReactiveFormsModule,
        RouterModule
    ],
    templateUrl: './register.html'
})
export class Register {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    loading = signal(false);
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);
    currentYear = new Date().getFullYear();
    maxBirthDate = new Date(new Date().setFullYear(new Date().getFullYear() - 10));

    form = this.fb.group(
        {
            name:                  ['', [Validators.required, Validators.minLength(3)]],
            email:                 ['', [Validators.required, Validators.email]],
            data_nascimento:       [null as Date | null, Validators.required],
            password:              ['', [Validators.required, Validators.minLength(6)]],
            password_confirmation: ['', Validators.required]
        },
        { validators: passwordMatchValidator }
    );

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null);

        const { name, email, password, password_confirmation, data_nascimento } = this.form.getRawValue();

        this.authService.criarUsuario({
            name: name!,
            email: email!,
            password: password!,
            password_confirmation: password_confirmation!,
            data_nascimento: data_nascimento!
        }).subscribe({
            next: () => {
                this.successMessage.set('Conta criada com sucesso! Redirecionando para o login...');
                setTimeout(() => this.router.navigate(['/auth/login']), 2000);
            },
            error: (err: Error) => {
                this.loading.set(false);
                this.errorMessage.set(err.message || 'Erro ao criar conta. Tente novamente.');
            },
            complete: () => {
                this.loading.set(false);
            }
        });
    }
}
