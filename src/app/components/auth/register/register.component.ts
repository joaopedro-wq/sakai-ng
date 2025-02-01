import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';
import { ValidatorCustomService } from 'src/app/validators/validator-custom.service';


@Component({
    templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit{
    confirmed: boolean = false;

    constructor( private formBuilder: FormBuilder, private authService: AuthService, private router: Router, public messageService: MessageService, public validatorCustomService: ValidatorCustomService) {}

    ngOnInit(): void {
       
    }

    public formLogin: FormGroup = this.formBuilder.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required, Validators.minLength(8), this.validatorCustomService.confirmPasswordValidator]]
    });
    


    navigateToLogin() {
        this.router.navigate([`/auth/login`]);
    }
    registerUser() {
        if (this.formLogin.valid) {
            console.log('this.formLogin.value', this.formLogin.value);
            
            // Obter o token CSRF antes de tentar criar o usuário
            this.authService.getCrsfToken().subscribe({
                next: () => {
                    // Após obter o token, fazemos a requisição para criar o usuário
                    this.authService.criarUsuario(this.formLogin.value).subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Sucesso',
                                detail: 'Usuário cadastrado com sucesso',
                            });
                            // Se necessário, redireciona ou faz outra ação
                             this.navigateToLogin(); 
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erro',
                                detail: error.message,
                            });
                        }
                    });
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro ao obter CSRF Token',
                        detail: error.message,
                    });
                }
            });
        }
    }
    
}
