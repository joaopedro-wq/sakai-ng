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
import { Metas } from '../api/metas';

@Injectable({
    providedIn: 'root',
})
export class NutrionService {
   

  
    public goalsList!: Metas[];
    private formGoal!: Metas;
    obsListGoal: EventEmitter<Metas[]> = new EventEmitter();
    obsLoadGoal: EventEmitter<Metas> = new EventEmitter();
    obsSaveGoal: EventEmitter<any> = new EventEmitter();
    obsDeleteGoal: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpPersonService,
        private barButtonsService: BarButtonsService,
        private datePipe: DatePipe,

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
                let saveFormGoal: Metas = this.formGoal;
                
                if (saveFormGoal.id) {
                   
                    this.updateGoal(saveFormGoal).subscribe();

                } else {
                    this.createGoal(saveFormGoal).subscribe();
                }
                break;
            case 'excluir':
                this.confirmDeleteDiet();
                break;
           case 'filtro':
           this.openModalFilter = true; 
           break;
        }
    }
   
    openModalFilter: boolean = false;

 

    loadGoals(): Observable<any> {
        return this.http.get('/api/meta').pipe(
            tap((res: any) => {
                if (res.success) {
                    this.goalsList = res.data;
                    this.obsListGoal.emit(this.goalsList);
                }
            }),
            catchError((error: any) => {
                console.error('Error :', error);
                return throwError(() => new Error(error.message || error));
            })
        );
    }

    loadGoal(id: number): Observable<any> {
        return this.http.get(`/api/meta/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                if (res.success) {
                    this.obsLoadGoal.emit(res.data);
                }
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    deleteGoal(id: number): Observable<any> {
        return this.http.delete(`/api/meta/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsDeleteGoal.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    updateGoal(formGoal: Metas): Observable<any> {
        return this.http
            .put(`/api/meta/${formGoal.id}`, formGoal)
            .pipe(
                tap((res: any) => {
                    // Executa uma ação quando a requisição for bem-sucedida
                    this.obsSaveGoal.emit(res);
                }),
                catchError((error: any) => {
                    // Trata o erro da requisição e propaga o erro através de um Observable de erro
                    return throwError(() => new Error(error));
                })
            );
    }

    createGoal(formGoal: Metas): Observable<any> {
        
        return this.http.post('/api/meta', formGoal).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsSaveGoal.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    
    public setformGoal(formRegister: Metas) {
        
        this.formGoal = formRegister;
       
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
                let registerId: number | undefined = this.formGoal.id;
                if (registerId) this.deleteGoal(registerId).subscribe();
            },
            reject: () => {},
        });
    }
}
