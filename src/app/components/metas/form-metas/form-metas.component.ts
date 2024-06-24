import {  Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Alimento } from 'src/app/api/alimento';
import { Dieta } from 'src/app/api/dieta';
import { Recomendacao } from 'src/app/api/recomendacao';
import { Refeicao } from 'src/app/api/refeicao';
import { GoalService } from 'src/app/service/metas.service';
import { NutritionService } from 'src/app/service/recomendacao.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Metas } from 'src/app/api/metas';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';


@Component({
    templateUrl: './form-metas.component.html',
    providers: [DialogService],
})
export class FormMetasComponent implements OnInit, OnDestroy {
    private unsubscribe = new Subject<void>();
    listFoodies!: Alimento[];
    listSnackies!: Refeicao[];
    diet: Dieta[] = [];
    position: string = 'top';
    checked: boolean = false;
    qtd: any;
    nutrition: Recomendacao[] = [];
    goal: Metas[] = [];

    public formNutrition: FormGroup = this.formBuilder.group({
        id: [null],
        get: ['', [Validators.required]],
        tmb: ['', [Validators.required, Validators.email]],
        caloria: ['', [Validators.required]],
        proteina: ['', [Validators.required]],
        carbo: ['', [Validators.required]],
        gordura: ['', [Validators.required]],
    });
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        public nutritionService: NutritionService,
        private dialogService: DialogService,
        public goalService: GoalService,
        private confirmationService: ConfirmationService
    ) {
        this.goalService.obsLoadGoal
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.formGoal.patchValue({
                    id: res.id ? res.id : null,
                    meta_calorias: res.meta_calorias,
                    meta_proteinas: res.meta_proteinas,
                    meta_carboidratos: res.meta_carboidratos,
                    meta_gorduras: res.meta_gorduras,
                });
            });

        this.goalService.obsSaveGoal
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.messageService.add({
                    severity: res.success ? 'success' : 'error',
                    summary: res.success ? 'Sucesso' : 'Erro',
                    detail: res.message,
                });

                if (res.success) this.router.navigate(['/metas']);
            });

        this.goalService.obsDeleteGoal
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.messageService.add({
                    severity: res.success ? 'success' : 'error',
                    summary: res.success ? 'Sucesso' : 'Erro',
                    detail: res.message,
                });
                if (res.success) this.router.navigate(['/metas']);
            });

        this.nutritionService.obsLoadNutrition
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.formNutrition.patchValue({
                    id: res.id,
                    get: res.get,
                    tmb: res.tmb,
                    caloria: res.caloria,
                    proteina: res.proteina,
                    gordura: res.gordura,
                    carbo: res.carbo,
                });
            });
        this.nutritionService.obsListNutritions
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.nutrition = res;
            });

        this.goalService.obsListGoal
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.goal = res;
               
                if (this.goal.length == 0) {
                    this.confirmationService.confirm({
                        message:
                            'Deseja incluir as recomendações geradas pelo sistema com base no seu perfil?',
                        header: 'Confirmação',
                        icon: 'pi pi-exclamation-triangle',
                        acceptLabel: 'Sim',
                        rejectLabel: 'Não',
                        
                        accept: () => {
                            
                            this.nutritionData = this.nutrition[0];
                        },
                        reject: () => {
                            
                        },
                    });
                }
            });
    }

    public formGoal: FormGroup = this.formBuilder.group({
        id: [null],
        data: [''],
        meta_calorias: [, [Validators.required]],
        meta_proteinas: [, [Validators.required]],
        meta_carboidratos: [, [Validators.required]],
        meta_gorduras: [, [Validators.required]],
    });
    nutritionData: any;
    ngOnInit() {
        this.goalService.loadButtons('form');
        this.formGoal.setValidators(this.totalNutrientsValidator());
        
        
    }

    ngAfterContentInit(): void {
        this.formGoal.statusChanges.subscribe((res) => {
            if (res === 'INVALID') {
                this.goalService.buttonState('disabled', 'salvar', true);
            } else {
                this.goalService.buttonState('disabled', 'salvar', false);
            }
        });

        this.formGoal.valueChanges.subscribe((res) => {
            if (this.formGoal.get('id')?.value) {
                this.goalService.buttonState('visible', 'excluir', true);
            } else {
                this.goalService.buttonState('visible', 'excluir', false);
            }
            this.goalService.setformGoal(res);
        });
    }
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    totalNutrientsValidator() {
        return (formGroup: FormGroup) => {
            const meta_calorias = formGroup.get('meta_calorias')?.value || 0;
            const meta_proteinas = formGroup.get('meta_proteinas')?.value || 0;
            const meta_carboidratos =
                formGroup.get('meta_carboidratos')?.value || 0;
            const meta_gorduras = formGroup.get('meta_gorduras')?.value || 0;

            const totalNutrients =
                meta_proteinas + meta_carboidratos + meta_gorduras;

            if (totalNutrients > meta_calorias) {
                formGroup
                    .get('meta_proteinas')
                    ?.setErrors({ nutrientSumExceeded: true });
                formGroup
                    .get('meta_carboidratos')
                    ?.setErrors({ nutrientSumExceeded: true });
                formGroup
                    .get('meta_gorduras')
                    ?.setErrors({ nutrientSumExceeded: true });
            } else {
                formGroup.get('meta_proteinas')?.setErrors(null);
                formGroup.get('meta_carboidratos')?.setErrors(null);
                formGroup.get('meta_gorduras')?.setErrors(null);
            }

            return null;
        };
    }
}
