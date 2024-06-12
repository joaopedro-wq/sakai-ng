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
import { Subject, takeUntil } from 'rxjs';
import { Alimento } from 'src/app/api/alimento';
import { Dieta } from 'src/app/api/dieta';
import { Refeicao } from 'src/app/api/refeicao';
import { FoodService } from 'src/app/service/alimento.service';
import { DietService } from 'src/app/service/dieta.service';
import { GoalService } from 'src/app/service/metas.service';
import { SnackService } from 'src/app/service/refeicao.service';
import { RegisterService } from 'src/app/service/registro.service';

@Component({
    templateUrl: './form-metas.component.html',
    providers: [],
})
export class FormMetasComponent implements OnInit, OnDestroy {
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
        private messageService: MessageService,
        public goalService: GoalService,
       
       
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
      
    }

    public formGoal: FormGroup = this.formBuilder.group({
        id: [null],
        data: [''],
        meta_calorias: [ , [Validators.required]],
        meta_proteinas: [ , [Validators.required]],
        meta_carboidratos: [ , [Validators.required]],
        meta_gorduras: [ , [Validators.required]],

    });

   
   

  
 

    ngOnInit() {
        this.goalService.loadButtons('form');
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

 
}
