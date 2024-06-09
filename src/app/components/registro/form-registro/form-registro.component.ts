import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { Alimento } from 'src/app/api/alimento';
import { Dieta } from 'src/app/api/dieta';
import { Refeicao } from 'src/app/api/refeicao';
import { FoodService } from 'src/app/service/alimento.service';
import { DietService } from 'src/app/service/dieta.service';
import { SnackService } from 'src/app/service/refeicao.service';
import { RegisterService } from 'src/app/service/registro.service';

@Component({
    templateUrl: './form-registro.component.html',
    providers: [],
})
export class FormRegistroComponent implements OnInit, OnDestroy {
    private unsubscribe = new Subject<void>();
    listFoodies!: Alimento[];
    listSnackies!: Refeicao[];
    diet: Dieta[] = [];
    position: string = 'top';
    checked: boolean = false;
    qtd: any;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        public foodService: FoodService,
        public registerService: RegisterService,
        private messageService: MessageService,
        public snackService: SnackService,
        public dietService: DietService
    ) {
        this.registerService.obsLoadRegister
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.formRegister.patchValue({
                    id: res.id ? res.id : null,
                    id_refeicao: res.id_refeicao,
                    data: new Date(res.data),
                });
                const alimentosArray = this.formRegister.get(
                    'alimentos'
                ) as FormArray;
                alimentosArray.clear();
                
                if (res.alimentos && res.alimentos.length > 0) {
                    res.alimentos.forEach((alimento) => {
                        alimentosArray.push(
                            this.createAlimentoGroup(
                                alimento.id,
                                alimento.pivot.qtd
                            )
                        );
                    });
                } else {
                    alimentosArray.push(this.createAlimentoGroup());
                }
            });

        this.registerService.obsSaveRegister
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.messageService.add({
                    severity: res.success ? 'success' : 'error',
                    summary: res.success ? 'Sucesso' : 'Erro',
                    detail: res.message,
                });

                if (res.success) this.router.navigate(['/registros']);
            });

        this.registerService.obsDeleteRegister
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.messageService.add({
                    severity: res.success ? 'success' : 'error',
                    summary: res.success ? 'Sucesso' : 'Erro',
                    detail: res.message,
                });
                if (res.success) this.router.navigate(['/registros']);
            });

        this.foodService.obsListFoods
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.listFoodies = res;
            });

        this.snackService.obsListSnacks
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.listSnackies = res;
            });

        this.dietService.obsListDiet
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.diet = res;
            });
    }

    public formRegister: FormGroup = this.formBuilder.group({
        id: [null],
        data: [null, [Validators.required]],
        id_refeicao: ['', [Validators.required]],
        alimentos: this.formBuilder.array([this.createAlimentoGroup()]),
    });

    createAlimentoGroup(id: number = null, qtd: number = null): FormGroup {
        return this.formBuilder.group({
            id: [id, Validators.required],
            qtd: [qtd, [Validators.required, Validators.min(1)]],
        });
    }

    onDietChange(event: any): void {
       
        const selectedDiet = this.diet.find((d) => d.id === event.value);
        
        if (selectedDiet) {
            this.formRegister.patchValue({
                id_refeicao: selectedDiet.id_refeicao,
            });
            const alimentosArray = this.formRegister.get(
                'alimentos'
            ) as FormArray;
            alimentosArray.clear();

            selectedDiet.alimentos.forEach((alimento: any) => {
                alimentosArray.push(
                    this.createAlimentoGroup(alimento.id, alimento.pivot.qtd)
                );
            });
        }
    }

    createFormControl(): FormControl {
        return new FormControl(null, Validators.required);
    }

    removeFood(index: number): void {
        const alimentos = this.formRegister.get('id_alimento') as FormArray;
        const qtd = this.formRegister.get('qtd') as FormArray;
        if (alimentos.length > 1 && qtd.length > 1) {
            // Ensure there's always at least one field
            alimentos.removeAt(index);
            qtd.removeAt(index);
        }
    }

    addFood(): void {
        const alimentos = this.alimentos;
        alimentos.push(this.createAlimentoGroup());
    }

    ngOnInit() {
        this.registerService.loadButtons('form');
    }

    ngAfterContentInit(): void {
        this.formRegister.statusChanges.subscribe((res) => {
            if (res === 'INVALID') {
                this.registerService.buttonState('disabled', 'salvar', true);
            } else {
                this.registerService.buttonState('disabled', 'salvar', false);
            }
        });

        this.formRegister.valueChanges.subscribe((res) => {
            if (this.formRegister.get('id')?.value) {
                this.registerService.buttonState('visible', 'excluir', true);
            } else {
                this.registerService.buttonState('visible', 'excluir', false);
            }
            this.registerService.setformFood(res);
        });
    }
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    get alimentos(): FormArray {
        return this.formRegister.get('alimentos') as FormArray;
    }

    fecharModal() {
        this.registerService.modalFIlter = false;
        this.registerService.loadButtons('form');
    }
}
