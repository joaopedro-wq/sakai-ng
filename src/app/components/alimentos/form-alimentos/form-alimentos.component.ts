import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { FoodService } from 'src/app/service/alimento.service';
import { MessageService } from 'primeng/api';


@Component({
    templateUrl: './form-alimentos.component.html',
    providers: [],
})
export class FormAlimentosComponent
    implements OnInit, OnDestroy
{
    private unsubscribe = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        public foodService: FoodService
    ) {
        this.foodService.obsLoadFood
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.formFood.patchValue({
                    id: res.id ? res.id : null,
                    descricao: res.descricao,
                    caloria: res.caloria,
                    proteina: res.proteina,
                    gordura: res.gordura,
                    carbo: res.carbo,
                    qtd: res.qtd,

                });
            });

            this.foodService.obsSaveFood
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.messageService.add({
                    severity: res.success ? 'success' : 'error',
                    summary: res.success ? 'Sucesso' : 'Erro',
                    detail: res.message,
                    
                }); 
                
                if (res.success) this.router.navigate(['/alimentos']);
            });

            this.foodService.obsDeleteFood
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.messageService.add({
                    severity: res.success ? 'success' : 'error',
                    summary: res.success ? 'Sucesso' : 'Erro',
                    detail: res.message,
                });
                if (res.success) this.router.navigate(['/alimentos']);
            });

    }
    
    public formFood: FormGroup = this.formBuilder.group({
        id: [null],
        descricao: ['', [Validators.required]],
        proteina: [ , [Validators.required]],
        caloria: [ , [Validators.required]],
        carbo: [ , [Validators.required]],
        gordura: [ , [Validators.required]],
        qtd: [ , [Validators.required]],
    });

    dropdownStatus = [
        { label: 'Ativo', value: true },
        { label: 'Inativo', value: false },
    ];

    selectedStatus: string = 'active';

    

    breadcrumbItems: MenuItem[] = [];
    ngOnInit() {
         this.foodService.loadButtons('form');  
          
    }
  

    ngAfterContentInit(): void {
        this.formFood.statusChanges.subscribe((res) => {
            if (res === 'INVALID') {
                this.foodService.buttonState('disabled', 'salvar', true);
            } else {
                this.foodService.buttonState('disabled', 'salvar', false);
            }
        });

        this.formFood.valueChanges.subscribe((res) => {
            if (this.formFood.get('id')?.value) {
                this.foodService.buttonState('visible', 'excluir', true);
            } else {
                this.foodService.buttonState('visible', 'excluir', false);
            }

            this.foodService.setformFood(res);
        });
    }   
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
       
    }
}
