import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../api/user';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { ValidatorCustomService } from '../../validators/validator-custom.service';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
    templateUrl: './profile.component.html',
    providers: [],
})
export class ProfileComponent implements OnInit, AfterContentInit, OnDestroy {
    private unsubscribe = new Subject<void>();

    public formProfile: FormGroup = this.formBuilder.group({
        id: [null],
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        avatar: [''],
        peso: ['', [Validators.required]],
        genero: ['', [Validators.required]],
        altura: ['', [Validators.required]],
        nivel_atividade: ['', [Validators.required]],
        data_nascimento: [null, [Validators.required]],
        objetivo: [null, [Validators.required]],
    });

    constructor(
        private messageService: MessageService,
        public authService: AuthService,
        public profileService: ProfileService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private confirmationService: ConfirmationService,
        private validatorCustom: ValidatorCustomService
    ) {
        this.authService.obsGetLoggedUser
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.formProfile.patchValue({
                    id: res.id ? res.id : null,
                    name: res.name,
                    email: res.email,
                    avatar: res.avatar,
                    data_nascimento: new Date(res.data_nascimento),
                    genero: res.genero,
                    altura: res.altura,
                    peso: res.peso,
                    nivel_atividade: res.nivel_atividade,
                    objetivo: res.objetivo,
                });
                let userId: number = this.formProfile.get('id')?.value;
                this.formUserPassword.get('id')?.setValue(userId);
            });

        this.profileService.obsSaveUserProfile
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                if (res) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Perfil atualizado com sucesso!',
                    });
                }
            });

        this.profileService.obsSaveUserPassword
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                if (res) {
                    this.profileService.toggleModalChangePassword();
                    let userId: number = this.formProfile.get('id')?.value;
                    this.formUserPassword.get('id')?.setValue(userId);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Senha alterada com sucesso!',
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao alterar senha.',
                    });
                }
            });
    }

    ngOnInit(): void {
        this.profileService.loadButtons('form');
    }

    ngAfterContentInit(): void {
        this.formProfile.statusChanges.subscribe((res) => {
            if (res === 'INVALID' || !this.formProfile.dirty) {
                this.profileService.buttonState('disabled', 'salvar', true);
            } else {
                this.profileService.buttonState('disabled', 'salvar', false);
            }
        });

        this.formProfile.valueChanges.subscribe((res) => {
            this.profileService.setformUserProfile(res);
            this.calculateBasalMetabolicRate(); // Calcular TMB e GET sempre que os valores mudarem
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onUploadAuto(event: any) {
        if (event.originalEvent.body) {
            this.authService.getLoggedUserWithToken().subscribe();
            this.messageService.add({
                severity: 'success',
                summary: 'Successo',
                detail: 'Imagem carregada com sucesso!',
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar imagem.',
            });
        }
    }

    getUserAvatar(): string {
        if (this.formProfile.get('avatar')?.value) {
            return (
                'http://127.0.0.1:8000' + this.formProfile.get('avatar')?.value
            );
        } else {
            return 'assets/contents/images/default-profile.png';
        }
    }

    getUrlToUpload(): string {
        return `http://127.0.0.1:8000/api/user/update-profile-pic/${
            this.formProfile.get('id')?.value
        }`;
    }

    selectedFile: File | null = null;

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    onSubmit(): void {
        const userId = 1; // ID do usuário
        const file: File = this.selectedFile;

        if (file) {
            this.profileService.updateProfilePic(userId, file).subscribe(
                (response) => {
                    console.log(response);
                },
                (error) => {
                    console.error(error);
                }
            );
        }
    }

    confirmDeleteUserProfilePic() {
        this.confirmationService.confirm({
            target: new EventTarget(),
            message: 'Realmente deseja excluir a foto de perfil?',
            header: 'Confirmação de exclusão',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-outlined',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Excluir',
            rejectLabel: 'Cancelar',

            accept: () => {
                let userId: number = this.formProfile.get('id')?.value;
                if (userId)
                    this.profileService
                        .deleteUserProfilePic(userId)
                        .subscribe((res) => {
                            if (res.success) {
                                this.authService
                                    .getLoggedUserWithToken()
                                    .subscribe();
                            }
                        });
            },
            reject: () => {},
        });
    }

    public formUserPassword: FormGroup = this.formBuilder.group({
        id: [null],
        password: [null, [Validators.required]],
        password_confirmation: [
            null,
            [
                this.validatorCustom.confirmPasswordValidator,
                Validators.required,
            ],
        ],
    });

    saveUserPassword() {
        this.profileService
            .updateUserPassword(this.formUserPassword.getRawValue())
            .subscribe();
    }
    objetivoOptions = [
        { label: 'Perda de Peso', value: 'perda_peso' },
        { label: 'Ganho de Massa', value: 'ganho_massa' },
        { label: 'Manutenção de Peso', value: 'manutencao_peso' },
    ];
    generoOptions = [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' },
    ];

    atividadeFisicaOptions = [
        { label: 'Sedentário (pouco ou nenhum exercício)', value: '1.2' },
        {
            label: 'Levemente ativo (exercício leve/sessões de esporte de 1 a 3 dias por semana)',
            value: '1.375',
        },
        {
            label: 'Moderadamente ativo (exercício moderado/sessões de esporte de 3 a 5 dias por semana)',
            value: '1.55',
        },
        {
            label: 'Muito ativo (exercício intenso/sessões de esporte de 6 a 7 dias por semana)',
            value: '1.725',
        },
        {
            label: 'Extremamente ativo (exercício físico muito intenso/trabalho físico, sessões de esporte, etc.)',
            value: '1.9',
        },
    ];

    // Método para calcular a TMB e o GET
    calculateBasalMetabolicRate(): void {
        const peso = this.formProfile.get('peso')?.value;
        const altura = this.formProfile.get('altura')?.value;
        const genero = this.formProfile.get('genero')?.value;
        const dataNascimento = this.formProfile.get('data_nascimento')?.value;
        const nivelAtividade = this.formProfile.get('nivel_atividade')?.value;

        if (peso && altura && genero && dataNascimento && nivelAtividade) {
            const idade = this.calculateAge(dataNascimento);

            let tmb: number;

            if (genero === 'M') {
                tmb = 66.47 + 13.75 * peso + 5.003 * altura - 6.755 * idade;
            } else if (genero === 'F') {
                tmb = 655.1 + 9.563 * peso + 1.85 * altura - 4.676 * idade;
            } else {
                return;
            }

            const get = tmb * parseFloat(nivelAtividade);
            this.get = get;
            this.tmb = tmb;
        }
    }

    // Método para calcular a idade com base na data de nascimento
    calculateAge(birthDate: Date): number {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }
        return age;
    }
    tmb: number | undefined;
    get: number | undefined;

    proteinasRecomendadas(): number {
        return (this.get * 0.3) / 4; // 30% das calorias totais, 1 grama de proteína tem cerca de 4 calorias
    }

    gordurasRecomendadas(): number {
        return (this.get * 0.3) / 9; // 30% das calorias totais, 1 grama de gordura tem cerca de 9 calorias
    }

    carboidratosRecomendados(): number {
        return (this.get * 0.4) / 4; // 40% das calorias totais, 1 grama de carboidrato tem cerca de 4 calorias
    }

    displayHelpDialog: boolean = false;
    helpText: string = '';

    showHelp(type: string) {
        if (type === 'TMB') {
            this.helpText =
                'A Taxa Metabólica Basal (TMB) é a quantidade mínima de energia (calorias) que seu corpo precisa para realizar suas funções vitais em repouso.';
        } else if (type === 'GET') {
            this.helpText =
                'O Gasto Energético Total (GET) é a quantidade total de calorias que você precisa por dia, levando em consideração seu nível de atividade física.';
        }
        this.displayHelpDialog = true;
    }
}
