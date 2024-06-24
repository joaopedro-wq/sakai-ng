import { EventEmitter, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { BarButtonsService } from '../shared/service/bar-buttons.service';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpPersonService } from './http-person.service';
import { Metas } from '../api/metas';
import { Recomendacao } from '../api/recomendacao';
import { Button } from '../shared/api/button';
import { BarButton } from '../shared/api/bar-button';
import { ActionButton } from '../shared/api/action-button';

@Injectable({
    providedIn: 'root',
})
export class NutritionService {
    private buttonsForm: Array<Button> = [
        {
            title: 'salvar',
            label: 'Gerar',
            id: 'Metas_salvar',
            visible: true,
            disabled: false,
            class: 'p-button-success mr-2',
            icon: 'pi pi-save',
            routerLink: [],
            tooltip: '',
        },
    ];
    private barButton: BarButton = {
        keyService: 'GoalService',
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

    public nutritionList!: Recomendacao[];
    private formNutrition!: Recomendacao;
    obsListNutritions: EventEmitter<Recomendacao[]> = new EventEmitter();
    obsLoadNutrition: EventEmitter<Recomendacao> = new EventEmitter();
    obsSaveNutrition: EventEmitter<any> = new EventEmitter();
    obsDeleteNutrition: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpPersonService,
        private barButtonsService: BarButtonsService,
        private confirmationService: ConfirmationService
    ) {
        this.barButtonsService.execActionButton.subscribe(
            (res: ActionButton) => {
                if (res.keyService == 'GoalService') {
                    this.execActionButton(res.actionButton);
                }
            }
        );
    }
    execActionButton(action: string) {
        switch (action) {
            case 'salvar':
                let saveFormGoal: Recomendacao = this.formNutrition;
               
                if (this.nutritionList.length > 0) {
                            
                   const nutritionItem = this.nutritionList[0];

                   
                    saveFormGoal.id = nutritionItem.id;
                
                   
                       
                      
                            this.updateNutrition(saveFormGoal).subscribe(
                                (res: any) => {
                                    if (res.success) {
                                        
                                        const index =
                                            this.nutritionList.findIndex(
                                                (item) =>
                                                    item.id === res.data.id
                                            );
                                        if (index !== -1) {
                                            this.nutritionList[index] =
                                                res.data; 
                                        } else {
                                            this.nutritionList.push(res.data); 
                                        }
                                        
                                    }
                                }
                            );

                        
                    }else {
                            
                            this.createNutrition(saveFormGoal).subscribe(
                                (res: any) => {
                                    if (res.success) {
                                        this.nutritionList.push(res.data); 
                                       
                                    }
                                }
                            );

                        }
         
        
                    break;
                }
        
    }
    loadButtons(nmListButtons: string) {
        if (nmListButtons == 'form') {
            this.barButton.buttons = this.buttonsForm;
        } 

        this.barButtonsService.startBarraButtons(this.barButton);
    }
    loadNutritions(): Observable<any> {
        return this.http.get('/api/recomendacao').pipe(
            tap((res: any) => {
                if (res.success) {
                    this.nutritionList = res.data;
                    this.obsListNutritions.emit(this.nutritionList);
                }
            }),
            catchError((error: any) => {
                console.error('Error :', error);
                return throwError(() => new Error(error.message || error));
            })
        );
    }

    loadNutrition(id: number): Observable<any> {
        return this.http.get(`/api/recomendacao/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                if (res.success) {
                    this.obsLoadNutrition.emit(res.data);
                }
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    deleteNutrition(id: number): Observable<any> {
        return this.http.delete(`/api/recomendacao/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsDeleteNutrition.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    updateNutrition(formGoal: Recomendacao): Observable<any> {
        return this.http.put(`/api/recomendacao/${formGoal.id}`, formGoal).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsSaveNutrition.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    createNutrition(formGoal: Recomendacao): Observable<any> {
        return this.http.post('/api/recomendacao', formGoal).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.formNutrition.id = res.data.id;
                this.obsSaveNutrition.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    public setformGoal(formRegister: Recomendacao) {
        this.formNutrition = formRegister;
        
    }

    confirmDeleteNutrition() {
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
                let registerId: number | undefined = this.formNutrition.id;
                if (registerId) this.deleteNutrition(registerId).subscribe();
            },
            reject: () => {},
        });
    }
}
