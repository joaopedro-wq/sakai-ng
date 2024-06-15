import { EventEmitter, Injectable } from '@angular/core';
import { ActionButton } from 'src/app/shared/api/action-button';
import { BarButton } from 'src/app/shared/api/bar-button';
import { Button } from 'src/app/shared/api/button';
import { BarButtonsService } from 'src/app/shared/service/bar-buttons.service';
import { User } from '../api/user';
import { DatePipe } from '@angular/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpPersonService } from './http-person.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private buttonsForm: Array<Button> = [
        {
            title: 'alterar_senha',
            label: 'Alterar senha',
            id: 'profile_alterar_senha',
            visible: true,
            disabled: false,
            class: 'p-button-outlined',
            icon: 'pi pi-key',
            routerLink: [],
            tooltip: '',
        },
        {
            title: 'salvar',
            label: 'Salvar',
            id: 'profile_salvar',
            visible: true,
            disabled: true,
            class: 'p-button-success',
            icon: 'pi pi-save',
            routerLink: [],
            tooltip: '',
        },
        {
            title: 'voltar',
            label: 'Voltar',
            id: 'profile_voltar',
            visible: true,
            disabled: false,
            class: 'p-button-outlined p-button-plain',
            icon: 'pi pi-chevron-left',
            routerLink: ['/'],
            tooltip: '',
        },
    ];

    private barButton: BarButton = {
        keyService: 'ProfileService',
        buttons: [],
    };

    buttonState(action: string, nmButton: string, value: boolean) {
        switch (action) {
            case 'disabled':
                this.barButton.buttons.filter((button) => {
                    if (button.title == nmButton) {
                        button.disabled = value;
                    }
                });
                break;
            case 'visible':
                this.barButton.buttons.filter((button) => {
                    if (button.title == nmButton) {
                        button.visible = value;
                    }
                });
                break;
        }
    }

    private formUserProfile!: User;
    obsSaveUserProfile: EventEmitter<boolean> = new EventEmitter();
    obsSaveUserPassword: EventEmitter<boolean> = new EventEmitter();
    obsSaveUser: EventEmitter<boolean> = new EventEmitter();
    
    constructor(
        private http: HttpPersonService,
        private barButtonsService: BarButtonsService,
        private datePipe: DatePipe
    ) {
        this.barButtonsService.execActionButton.subscribe(
            (res: ActionButton) => {
                if (res.keyService == 'ProfileService') {
                    this.execActionButton(res.actionButton);
                }
            }
        );
    }

    execActionButton(action: string) {
        switch (action) {
            case 'salvar':
                let saveFormUser: User = this.formUserProfile;
                saveFormUser.data_nascimento = this.datePipe.transform(
                    saveFormUser.data_nascimento,
                    'yyyy-MM-dd'
                )!;
                if (saveFormUser.id) {
                    this.updateUserProfile(saveFormUser).subscribe();
                }
                break;
            case 'alterar_senha':
                this.toggleModalChangePassword();
                break;
        }
    }

    showModalChangePassword: boolean = false;

    toggleModalChangePassword() {
        this.showModalChangePassword = !this.showModalChangePassword;
    }

    loadButtons(nmListButtons: string) {
        if (nmListButtons == 'form') {
            this.barButton.buttons = this.buttonsForm;
        }

        this.barButtonsService.startBarraButtons(this.barButton);
    }

     setformUserProfile(formUserProfile: User) {
        this.formUserProfile = formUserProfile;
    }


    registerUser(formUserPassword: User): Observable<any> {
        return this.http
            .post('/api/user', formUserPassword)
            .pipe(
                tap((res: any) => {
                    // Executa uma ação quando a requisição for bem-sucedida
                    this.obsSaveUserPassword.emit(res.success);
                }),
                catchError((error: any) => {
                    // Trata o erro da requisição e propaga o erro através de um Observable de erro
                    return throwError(() => new Error(error));
                })
            );
         }


    updateUserPassword(formUserPassword: User): Observable<any> {
        return this.http
            .put('/api/user/update-password', formUserPassword)
            .pipe(
                tap((res: any) => {
                    // Executa uma ação quando a requisição for bem-sucedida
                    this.obsSaveUser.emit(res.success);
                }),
                catchError((error: any) => {
                    // Trata o erro da requisição e propaga o erro através de um Observable de erro
                    return throwError(() => new Error(error));
                })
            );
    }

    updateUserProfile(formUserProfile: User): Observable<any> {
        return this.http
            .put(
                `/api/user/update-profile/${formUserProfile.id}`,
                formUserProfile
            )
            .pipe(
                tap((res: any) => {
                    // Executa uma ação quando a requisição for bem-sucedida
                    this.obsSaveUserProfile.emit(res);
                }),
                catchError((error: any) => {
                    // Trata o erro da requisição e propaga o erro através de um Observable de erro
                    return throwError(() => new Error(error));
                })
            );
    }
    updateProfilePic(userId: number, file: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('avatar', file, file.name);
    
        return this.http.post(`/api/user/update-profile-pic/${userId}`, formData).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                console.log('Foto de perfil atualizada com sucesso', res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }
    

    deleteUserProfilePic(id: number): Observable<any> {
        return this.http.delete(`/api/user/delete-profile-pic/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }
}
