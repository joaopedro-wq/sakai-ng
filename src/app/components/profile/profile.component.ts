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
        data_nascimento: [null, [Validators.required]],
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
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onUploadAuto() {
        let saveFormProfile: User = this.formProfile.getRawValue();
        saveFormProfile.data_nascimento = this.datePipe.transform(
            saveFormProfile.data_nascimento,
            'yyyy-MM-dd'
        )!;
        this.profileService.updateUserProfile(saveFormProfile).subscribe();
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
       
        return `/api/user/update-profile-pic/${
            this.formProfile.get('id')?.value
        }`;
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
}
