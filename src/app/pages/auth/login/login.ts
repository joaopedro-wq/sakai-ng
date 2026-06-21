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
import { AuthCardComponent } from '../../../components/auth-card/auth-card.component';

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
    template: `
        <app-auth-card
            subtitle="Monitore sua saúde. Alcance seus objetivos."
            hint="Faça login para continuar">

            @if (errorMessage()) {
                <p-message severity="error" [text]="errorMessage()!" styleClass="w-full mb-6 text-sm" />
            }

            <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>

                <div class="mb-5">
                    <label for="loginEmail" class="block font-semibold text-sm mb-2"
                           style="color:var(--text-color)">E-mail</label>
                    <input pInputText id="loginEmail" type="email" formControlName="email"
                        placeholder="seu@email.com" autocomplete="email" class="w-full"
                        [class.ng-invalid]="form.get('email')!.invalid && form.get('email')!.touched"
                        [class.ng-dirty]="form.get('email')!.touched" />
                    @if (form.get('email')!.invalid && form.get('email')!.touched) {
                        @if (form.get('email')!.hasError('required')) {
                            <small class="text-red-500 text-xs mt-1 block">E-mail obrigatório.</small>
                        } @else if (form.get('email')!.hasError('email')) {
                            <small class="text-red-500 text-xs mt-1 block">Informe um e-mail válido.</small>
                        }
                    }
                </div>

                <div class="mb-2">
                    <label for="loginPassword" class="block font-semibold text-sm mb-2"
                           style="color:var(--text-color)">Senha</label>
                    <p-password inputId="loginPassword" formControlName="password"
                        placeholder="••••••••"
                        [toggleMask]="true" [fluid]="true" [feedback]="false"
                        autocomplete="current-password"
                        [inputStyleClass]="form.get('password')!.invalid && form.get('password')!.touched ? 'ng-invalid ng-dirty w-full' : 'w-full'" />
                    @if (form.get('password')!.invalid && form.get('password')!.touched) {
                        @if (form.get('password')!.hasError('required')) {
                            <small class="text-red-500 text-xs mt-1 block">Senha obrigatória.</small>
                        } @else if (form.get('password')!.hasError('minlength')) {
                            <small class="text-red-500 text-xs mt-1 block">A senha deve ter ao menos 6 caracteres.</small>
                        }
                    }
                </div>

                <div class="flex items-center justify-between mt-4 mb-8">
                    <div class="flex items-center gap-2">
                        <p-checkbox formControlName="rememberMe" id="rememberMe" [binary]="true" />
                        <label for="rememberMe" class="text-sm cursor-pointer select-none"
                               style="color:var(--text-color-secondary)">Lembrar-me</label>
                    </div>
                    <span class="text-sm font-semibold cursor-pointer" style="color:var(--primary-color)">
                        Esqueceu a senha?
                    </span>
                </div>

                <p-button type="submit" label="Entrar"
                    styleClass="w-full justify-center font-semibold"
                    [loading]="loading()" [disabled]="loading()" [rounded]="true"
                    icon="pi pi-sign-in" iconPos="right" />

            </form>

            <p class="text-center text-xs mt-8" style="color:var(--text-color-secondary)">
                Ainda não tem conta?
                <a routerLink="/auth/register"
                   class="font-semibold no-underline cursor-pointer ml-1"
                   style="color:var(--primary-color)">Cadastre-se</a>
            </p>

        </app-auth-card>
    `
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
