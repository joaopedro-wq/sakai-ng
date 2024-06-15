import { EventEmitter, Injectable } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { BarButtonsService } from "../shared/service/bar-buttons.service";
import { Observable, catchError, tap, throwError } from "rxjs";
import { Button } from 'src/app/shared/api/button';
import { BarButton } from "../shared/api/bar-button";
import { ActionButton } from "../shared/api/action-button";
import { HttpPersonService } from "./http-person.service"; 
import { Refeicao } from "../api/refeicao";


@Injectable({
    providedIn: 'root',
})
export class SnackService {
    private buttonsForm: Array<Button> = [
        {
            title: 'voltar',
            label: 'Voltar',
            id: 'Alimento_voltar',
            visible: true,
            disabled: false,
            class: 'p-button-outlined p-button-plain mr-2',
            icon: 'pi pi-chevron-left',
            routerLink: ['/refeicoes'],
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
            routerLink: ['/refeicoes/registro'],
            tooltip: '',
        },
    ];

    private barButton: BarButton = {
        keyService: 'RefeicaoService',
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
                    console.log('button',button)
                    if (button.title == nmButton) {
                        button.visible = value;
                    }
                });
                break;
        }
    } 

    public snacksList!: Refeicao [];
    private formSnack!: Refeicao;
    obsListSnacks: EventEmitter<Refeicao[]> = new EventEmitter();
    obsLoadSnack: EventEmitter<Refeicao> = new EventEmitter();
    obsSaveSnack: EventEmitter<any> = new EventEmitter();
    obsDeleteSnack: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpPersonService,
        private barButtonsService: BarButtonsService,
        
        private confirmationService: ConfirmationService
    ) {
       this.barButtonsService.execActionButton.subscribe(
            (res: ActionButton) => {
                if (res.keyService == 'RefeicaoService') {
                    this.execActionButton(res.actionButton);
                }
            }
        ); 
    }
    convertToTimeString(date: Date): string {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    execActionButton(action: string) {
        switch (action) {
            case 'salvar':
                
                let saveFormSnack: Refeicao = this.formSnack;
                saveFormSnack.horario = this.convertToTimeString(saveFormSnack.horario as unknown as Date);
             

                if (saveFormSnack.id) {
                    this.updateSnack(saveFormSnack).subscribe();
                } else {
                    this.createSnack(saveFormSnack).subscribe();
                }
                break;
            case 'excluir':
                this.confirmDeleteSnack();
                break;
        }
    }

    loadButtons(nmListButtons: string) {
        if (nmListButtons == 'form') {
            this.barButton.buttons = this.buttonsForm;
        } else if (nmListButtons == 'list') {
            this.barButton.buttons = this.buttonsList;
           
            
        }

        this.barButtonsService.startBarraButtons(this.barButton);
    } 

    loadSnackies(): Observable<any> {
        return this.http.get('/api/refeicao').pipe(
            tap((res: any) => {
                if (res.success) {
                    this.snacksList = res.data;
                    this.obsListSnacks.emit(this.snacksList);
        
                }
            }),
            catchError((error: any) => {
                console.error('Error:', error);
                return throwError(() => new Error(error.message || error));
            })
        );
    }
    

    loadSnack(id: number): Observable<any> {
        return this.http.get(`/api/refeicao/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                if (res.success) {
                    this.obsLoadSnack.emit(res.data);
                }
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    createSnack(formSnack: Refeicao): Observable<any> {
        return this.http.post('/api/refeicao', formSnack).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsSaveSnack.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    updateSnack(formSnack: Refeicao): Observable<any> {
        return this.http
            .put(`/api/refeicao/${formSnack.id}`, formSnack)
            .pipe(
                tap((res: any) => {
                    // Executa uma ação quando a requisição for bem-sucedida
                    this.obsSaveSnack.emit(res);
                }),
                catchError((error: any) => {
                    // Trata o erro da requisição e propaga o erro através de um Observable de erro
                    return throwError(() => new Error(error));
                })
            );
    }

    deleteSnack(id: number): Observable<any> {
        return this.http.delete(`/api/refeicao/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsDeleteSnack.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    public setformSnack(formSnack: Refeicao) {
       
        this.formSnack = formSnack;
      
    }

    confirmDeleteSnack() {
        this.confirmationService.confirm({
            target: new EventTarget(),
            message: 'Realmente deseja excluir esta Refeição?',
            header: 'Confirmação de exclusão',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-outlined',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Excluir',
            rejectLabel: 'Cancelar',

            accept: () => {
                let snackId: number | undefined = this.formSnack.id;
                if (snackId) this.deleteSnack(snackId).subscribe();
            },
            reject: () => {},
        });
    }
}
