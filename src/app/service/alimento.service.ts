import { EventEmitter, Injectable } from '@angular/core';
import { Alimento } from '../api/alimento';
import { DatePipe } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { BarButtonsService } from '../shared/service/bar-buttons.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Button } from 'src/app/shared/components/api/button';
import { BarButton } from '../shared/components/api/bar-button';
import { ActionButton } from '../shared/components/api/action-button';
import { HttpPersonService } from './http-person.service';

@Injectable({
    providedIn: 'root',
})
export class FoodService {
    private buttonsForm: Array<Button> = [
        {
            title: 'voltar',
            label: 'Voltar',
            id: 'Alimento_voltar',
            visible: true,
            disabled: false,
            class: 'p-button-outlined p-button-plain mr-2',
            icon: 'pi pi-chevron-left',
            routerLink: ['/alimentos'],
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
            routerLink: ['/alimentos/registro'],
            tooltip: '',
        },
    ];

    private barButton: BarButton = {
        keyService: 'AlimentoService',
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

    public foodsList!: Alimento[];
    private formFood!: Alimento;
    obsListFoods: EventEmitter<Alimento[]> = new EventEmitter();
    obsLoadFood: EventEmitter<Alimento> = new EventEmitter();
    obsSaveFood: EventEmitter<any> = new EventEmitter();
    obsDeleteFood: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpPersonService,
        private barButtonsService: BarButtonsService,

        private confirmationService: ConfirmationService
    ) {
        this.barButtonsService.execActionButton.subscribe(
            (res: ActionButton) => {
                if (res.keyService == 'AlimentoService') {
                    this.execActionButton(res.actionButton);
                }
            }
        );
    }

    execActionButton(action: string) {
        switch (action) {
            case 'salvar':
                let saveFormFood: Alimento = this.formFood;

                if (saveFormFood.id) {
                    this.updateFood(saveFormFood).subscribe();
                } else {
                    this.createFood(saveFormFood).subscribe();
                }
                break;
            case 'excluir':
                this.confirmDeleteFood();
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

    loadFoods(): Observable<any> {
        return this.http.get('/api/food').pipe(
            tap((res: any) => {
                if (res.success) {
                    this.foodsList = res.data;
                    this.obsListFoods.emit(this.foodsList);
                }
            }),
            catchError((error: any) => {
                console.error('Error ssss:', error);
                return throwError(() => new Error(error.message || error));
            })
        );
    }

    loadFood(id: number): Observable<any> {
        return this.http.get(`/api/food/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                if (res.success) {
                    this.obsLoadFood.emit(res.data);
                }
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    createFood(formFood: Alimento): Observable<any> {
        return this.http.post('/api/food', formFood).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsSaveFood.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    updateFood(formFood: Alimento): Observable<any> {
        return this.http.put(`/api/food/${formFood.id}`, formFood).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsSaveFood.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    deleteFood(id: number): Observable<any> {
        return this.http.delete(`/api/food/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsDeleteFood.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    public setformFood(formFood: Alimento) {
        this.formFood = formFood;
    }

    confirmDeleteFood() {
        this.confirmationService.confirm({
            target: new EventTarget(),
            message: 'Realmente deseja excluir este Alimento?',
            header: 'Confirmação de exclusão',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-outlined',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Excluir',
            rejectLabel: 'Cancelar',

            accept: () => {
                let foodId: number | undefined = this.formFood.id;
                if (foodId) this.deleteFood(foodId).subscribe();
            },
            reject: () => {},
        });
    }
}
