import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { FoodService } from 'src/app/service/alimento.service';
import { MessageService } from 'primeng/api';
import { DietService } from 'src/app/service/dieta.service';
import { Refeicao } from 'src/app/api/refeicao';
import { Alimento } from 'src/app/api/alimento';
import { SnackService } from 'src/app/service/refeicao.service';


@Component({
    templateUrl: './form-dieta.component.html',
    providers: [],
})
export class FormDietaComponent
    implements OnInit, OnDestroy
{
    private unsubscribe = new Subject<void>();
    listFoodies!: Alimento[];
    listSnackies!: Refeicao[];
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        public foodService: FoodService,
        public dietService: DietService,
        public snackService: SnackService


        
    ) {

        this.dietService.obsLoadDiet
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
            this.formDiet.patchValue({
                id: res.id ? res.id : null,
                descricao: res.descricao,
                id_refeicao: res.id_refeicao,
                alimentos: res.alimentos ? res.alimentos.map(alimento => alimento.id) : []

            });
            const alimentosArray = this.formDiet.get('alimentos') as FormArray;
                alimentosArray.clear(); 

                if (res.alimentos && res.alimentos.length > 0) {
                    res.alimentos.forEach(alimento => {
                        alimentosArray.push(new FormControl(alimento.id, Validators.required));
                    });
                } else {
                    alimentosArray.push(new FormControl(null, Validators.required));
                }
           
        });


            this.dietService.obsSaveDiet
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.messageService.add({
                    severity: res.success ? 'success' : 'error',
                    summary: res.success ? 'Sucesso' : 'Erro',
                    detail: res.message,
                    
                }); 
                
                if (res.success) this.router.navigate(['/dietas']);
            });

            this.dietService.obsDeleteDiet
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.messageService.add({
                    severity: res.success ? 'success' : 'error',
                    summary: res.success ? 'Sucesso' : 'Erro',
                    detail: res.message,
                });
                if (res.success) this.router.navigate(['/dietas']);
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

    }
    
    public formDiet: FormGroup = this.formBuilder.group({
        id: [null],
        descricao: ['', [Validators.required]],
        id_refeicao: ['', [Validators.required]],
        alimentos: new FormArray( [new FormControl()]),
    });

    removeFood(index: number): void {
        const alimentos = this.formDiet.get('alimentos') as FormArray;
       
        if (alimentos.length > 1) { 
          alimentos.removeAt(index);
        }
      }

    addFood(): void {
        const alimentos = this.formDiet.get('alimentos') as FormArray;

        alimentos.push(new FormControl(null, Validators.required));
      
      }
    ngOnInit() {
         this.dietService.loadButtons('form');  
          
    }
  

    ngAfterContentInit(): void {
        this.formDiet.statusChanges.subscribe((res) => {
            if (res === 'INVALID') {
                this.dietService.buttonState('disabled', 'salvar', true);
            } else {
                this.dietService.buttonState('disabled', 'salvar', false);
            }
        });

        this.formDiet.valueChanges.subscribe((res) => {
            if (this.formDiet.get('id')?.value) {
                this.dietService.buttonState('visible', 'excluir', true);
            } else {
                this.dietService.buttonState('visible', 'excluir', false);
            }

            this.dietService.setformDiet(res);
        });
    }   
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
       
    }
}
