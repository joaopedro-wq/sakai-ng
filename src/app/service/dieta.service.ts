import { EventEmitter, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { BarButtonsService } from '../shared/service/bar-buttons.service';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Button } from 'src/app/shared/api/button';
import { BarButton } from '../shared/api/bar-button';
import { ActionButton } from '../shared/api/action-button';
import { HttpPersonService } from './http-person.service';
import { Registro } from '../api/registro';
import { Dieta } from '../api/dieta';

@Injectable({
    providedIn: 'root',
})
export class DietService {
    private buttonsForm: Array<Button> = [
        {
            title: 'voltar',
            label: 'Voltar',
            id: 'Alimento_voltar',
            visible: true,
            disabled: false,
            class: 'p-button-outlined p-button-plain mr-2',
            icon: 'pi pi-chevron-left',
            routerLink: ['/dietas'],
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
            routerLink: ['/dietas/registro'],
            tooltip: '',
        },
    ];
    

    private barButton: BarButton = {
        keyService: 'DietService',
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

    public dietsList!: Dieta[];
    private formDiet!: Dieta;
    obsListDiet: EventEmitter<Dieta[]> = new EventEmitter();
    obsLoadDiet: EventEmitter<Dieta> = new EventEmitter();
    obsSaveDiet: EventEmitter<any> = new EventEmitter();
    obsDeleteDiet: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpPersonService,
        private barButtonsService: BarButtonsService,
        private datePipe: DatePipe,

        private confirmationService: ConfirmationService
    ) {
        this.barButtonsService.execActionButton.subscribe(
            (res: ActionButton) => {
                if (res.keyService == 'DietService') {
                    this.execActionButton(res.actionButton);
                }
            }
        );
    }

    execActionButton(action: string) {
        switch (action) {
            case 'salvar':
                let saveFormFood: Dieta = this.formDiet;
                
                if (saveFormFood.id) {
                   
                    this.updateDiet(saveFormFood).subscribe();

                } else {
                    this.createRegister(saveFormFood).subscribe();
                }
                break;
            case 'excluir':
                this.confirmDeleteDiet();
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
        } 

        this.barButtonsService.startBarraButtons(this.barButton);
    }

    loadDiets(): Observable<any> {
        return this.http.get('/api/dieta').pipe(
            tap((res: any) => {
                if (res.success) {
                    this.dietsList = res.data;
                    this.obsListDiet.emit(this.dietsList);
                }
            }),
            catchError((error: any) => {
                console.error('Error :', error);
                return throwError(() => new Error(error.message || error));
            })
        );
    }

    loadDiet(id: number): Observable<any> {
        return this.http.get(`/api/dieta/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                if (res.success) {
                    this.obsLoadDiet.emit(res.data);
                }
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    deleteDiet(id: number): Observable<any> {
        return this.http.delete(`/api/dieta/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsDeleteDiet.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    updateDiet(formDiet: Dieta): Observable<any> {
        return this.http
            .put(`/api/dieta/${formDiet.id}`, formDiet)
            .pipe(
                tap((res: any) => {
                    // Executa uma ação quando a requisição for bem-sucedida
                    this.obsSaveDiet.emit(res);
                }),
                catchError((error: any) => {
                    // Trata o erro da requisição e propaga o erro através de um Observable de erro
                    return throwError(() => new Error(error));
                })
            );
    }

    createRegister(formDiet: Dieta): Observable<any> {
        
        return this.http.post('/api/dieta', formDiet).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsSaveDiet.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    
    public setformDiet(formRegister: Dieta) {
        
        this.formDiet = formRegister;
       
    }

    confirmDeleteDiet() {
        this.confirmationService.confirm({
            target: new EventTarget(),
            message: 'Realmente deseja excluir esta Dieta?',
            header: 'Confirmação de exclusão',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-outlined',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Excluir',
            rejectLabel: 'Cancelar',

            accept: () => {
                let registerId: number | undefined = this.formDiet.id;
                if (registerId) this.deleteDiet(registerId).subscribe();
            },
            reject: () => {},
        });
    }
}
