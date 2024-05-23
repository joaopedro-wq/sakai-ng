import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SnackService } from 'src/app/service/refeicao.service';


@Component({
    templateUrl: './form-refeicao.component.html',
    providers: [],
})
export class FormRefeicaoComponent
    implements OnInit, OnDestroy
{
    private unsubscribe = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        public snackService: SnackService
    ) {
        this.snackService.obsLoadSnack
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.formSnack.patchValue({
                    id: res.id ? res.id : null,
                    descricao: res.descricao,
                
                });
            });

            this.snackService.obsSaveSnack
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.messageService.add({
                    severity: res.success ? 'success' : 'error',
                    summary: res.success ? 'Sucesso' : 'Erro',
                    detail: res.message,
                    
                }); 
                
                if (res.success) this.router.navigate(['/refeicoes']);
            });

            this.snackService.obsDeleteSnack
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.messageService.add({
                    severity: res.success ? 'success' : 'error',
                    summary: res.success ? 'Sucesso' : 'Erro',
                    detail: res.message,
                });
                if (res.success) this.router.navigate(['/refeicoes']);
            });

    }
    
    public formSnack: FormGroup = this.formBuilder.group({
        id: [null],
        descricao: ['', [Validators.required]],
        
    });

    ngOnInit() {
         this.snackService.loadButtons('form');  
          
    }
  
    ngAfterContentInit(): void {
        this.formSnack.statusChanges.subscribe((res) => {
            if (res === 'INVALID') {
                this.snackService.buttonState('disabled', 'salvar', true);
            } else {
                this.snackService.buttonState('disabled', 'salvar', false);
            }
        });

        this.formSnack.valueChanges.subscribe((res) => {
            if (this.formSnack.get('id')?.value) {
                this.snackService.buttonState('visible', 'excluir', true);
            } else {
                this.snackService.buttonState('visible', 'excluir', false);
            }

            this.snackService.setformSnack(res);
        });
    }   
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
       
    }
}
