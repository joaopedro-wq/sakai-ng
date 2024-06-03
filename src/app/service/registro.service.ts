import { EventEmitter, Injectable } from '@angular/core';
import { Alimento } from '../api/alimento';
import { DatePipe } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { BarButtonsService } from '../shared/service/bar-buttons.service';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Button } from 'src/app/shared/api/button';
import { BarButton } from '../shared/api/bar-button';
import { ActionButton } from '../shared/api/action-button';
import { HttpPersonService } from './http-person.service';
import { Registro } from '../api/registro';
import { FormArray } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class RegisterService {
    private buttonsForm: Array<Button> = [
        {
            title: 'voltar',
            label: 'Voltar',
            id: 'Alimento_voltar',
            visible: true,
            disabled: false,
            class: 'p-button-outlined p-button-plain mr-2',
            icon: 'pi pi-chevron-left',
            routerLink: ['/registros'],
            tooltip: '',
        },
        {
            title: 'excluir',
            label: 'Excluir',
            id: 'Alimento_excluir',
            visible: false,
            disabled: false,
            class: 'p-button-danger',
            icon: 'pi pi-trash',
            routerLink: [],
            tooltip: '',
        },
        {
            title: 'salvar',
            label: 'Salvar',
            id: 'Alimento_salvar',
            visible: true,
            disabled: true,
            class: 'p-button-success mr-2',
            icon: 'pi pi-save',
            routerLink: [],
            tooltip: '',
        },
    ];

    private buttonsList: Array<Button> = [
        {
            title: 'cadastrar',
            label: 'Cadastrar',
            id: 'Alimento_cadastrar',
            visible: true,
            disabled: false,
            class: 'inline-block',
            icon: 'pi pi-plus',
            routerLink: ['/registros/registro'],
            tooltip: '',
        },
    ];
    private buttonsDashboard: Array<Button> = [
        {
            title: 'Opcao',
            label: 'Filtro',
            id: 'Alimento_Opcao',
            visible: true,
            disabled: false,
            class: 'inline-block',
            icon: 'pi pi-filter',
            routerLink: [],
            tooltip: '',
        },
       
    ];

    private barButton: BarButton = {
        keyService: 'RegisterService',
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

    public registersList!: Registro[];
    private formRegister!: Registro;
    obsListRegister: EventEmitter<Registro[]> = new EventEmitter();
    obsLoadRegister: EventEmitter<Registro> = new EventEmitter();
    obsSaveRegister: EventEmitter<any> = new EventEmitter();
    obsDeleteRegister: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpPersonService,
        private barButtonsService: BarButtonsService,
        private datePipe: DatePipe,

        private confirmationService: ConfirmationService
    ) {
        this.barButtonsService.execActionButton.subscribe(
            (res: ActionButton) => {
                if (res.keyService == 'RegisterService') {
                    this.execActionButton(res.actionButton);
                }
            }
        );
    }

    execActionButton(action: string) {
        switch (action) {
            case 'salvar':
                let saveFormFood: Registro = this.formRegister;
                saveFormFood.data = this.datePipe.transform(
                    saveFormFood.data,
                    'yyyy-MM-dd'
                )!;

                if (saveFormFood.id) {
                    this.updateRegister(saveFormFood).subscribe();
                } else {
                    this.createRegister(saveFormFood).subscribe();
                }
                break;
            case 'excluir':
                this.confirmDeleteRegister();
                break;
            case 'Opcao':
            this.modalOptions = true;

                break;
        }
    }
   
    modalOptions: boolean = false;

    loadButtons(nmListButtons: string) {
        if (nmListButtons == 'form') {
            this.barButton.buttons = this.buttonsForm;
        } else if (nmListButtons == 'list') {
            this.barButton.buttons = this.buttonsList;
        } else if(nmListButtons == 'dashboard'){
            this.barButton.buttons = this.buttonsDashboard;
            
        }

        this.barButtonsService.startBarraButtons(this.barButton);
    }

    loadRegisters(): Observable<any> {
        return this.http.get('/api/registro').pipe(
            tap((res: any) => {
                if (res.success) {
                    this.registersList = res.data;
                    this.obsListRegister.emit(this.registersList);
                }
            }),
            catchError((error: any) => {
                console.error('Error :', error);
                return throwError(() => new Error(error.message || error));
            })
        );
    }

    loadRegister(id: number): Observable<any> {
        return this.http.get(`/api/registro/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                if (res.success) {
                    this.obsLoadRegister.emit(res.data);
                }
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    createRegister(formRegister: Registro): Observable<any> {
        
        return this.http.post('/api/registro', formRegister).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsSaveRegister.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    updateRegister(formRegister: Registro): Observable<any> {
        return this.http
            .put(`/api/registro/${formRegister.id}`, formRegister)
            .pipe(
                tap((res: any) => {
                    // Executa uma ação quando a requisição for bem-sucedida
                    this.obsSaveRegister.emit(res);
                }),
                catchError((error: any) => {
                    // Trata o erro da requisição e propaga o erro através de um Observable de erro
                    return throwError(() => new Error(error));
                })
            );
    }

    deleteRegister(id: number): Observable<any> {
        return this.http.delete(`/api/registro/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsDeleteRegister.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    public setformFood(formRegister: Registro) {
        this.formRegister = formRegister;
        console.log('this.formRegister', this.formRegister);
    }

    confirmDeleteRegister() {
        this.confirmationService.confirm({
            target: new EventTarget(),
            message: 'Realmente deseja excluir este Registro?',
            header: 'Confirmação de exclusão',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-outlined',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Excluir',
            rejectLabel: 'Cancelar',

            accept: () => {
                let registerId: number | undefined = this.formRegister.id;
                if (registerId) this.deleteRegister(registerId).subscribe();
            },
            reject: () => {},
        });
    }
}
