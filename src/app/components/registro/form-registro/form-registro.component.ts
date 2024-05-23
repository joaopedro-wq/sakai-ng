import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { Alimento } from 'src/app/api/alimento';
import { Refeicao } from 'src/app/api/refeicao';
import { FoodService } from 'src/app/service/alimento.service';
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

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        public foodService: FoodService,
        public registerService: RegisterService,
        private messageService: MessageService,
        public snackService: SnackService
    ) {
        this.registerService.obsLoadRegister
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.formRegister.patchValue({
                    id: res.id ? res.id : null,
                    data: new Date(res.data),
                    id_alimento: res.id_alimento,
                    id_refeicao: res.id_refeicao,
                    qtd: res.qtd,
                });
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
    }

    public formRegister: FormGroup = this.formBuilder.group({
        id: [null],
        data: [null, [Validators.required]],
        id_alimento: [],
        id_refeicao: ['', [Validators.required]],
        qtd: [],
    });

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
}
