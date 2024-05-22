import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { Alimento } from 'src/app/api/alimento';
import { FoodService } from 'src/app/service/alimento.service';
import { RegisterService } from 'src/app/service/registro.service';


@Component({
    templateUrl: './form-registro.component.html',
    providers: [],
})
export class FormRegistroComponent
    implements OnInit, OnDestroy
{
    private unsubscribe = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        public foodService: FoodService,
        public registerService: RegisterService

    ) {
        this.registerService.obsLoadRegister
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
            this.formRegister.patchValue({
                id: res.id ? res.id : null,
                descricao: res.descricao,
                data: res.data,
                id_alimento: res.id_alimento,
                qtd: res.qtd,

            });
        });

        this.foodService.obsListFoods
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.listFood = res;
               
            });

            this.registerService.obsSaveRegister
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
               /*  this.messageService.add({
                    severity: res.success ? 'success' : 'error',
                    summary: res.success ? 'Sucesso' : 'Erro',
                    detail: res.message,
                    
                });  */
                
                if (res.success) this.router.navigate(['/registros']);
            });

    }
    
    public formRegister: FormGroup = this.formBuilder.group({
        id: [null],
        descricao: ['', [Validators.required]],
        data: [ null, [Validators.required]],
        id_alimento: [ , [Validators.required]],
        qtd: [ , [Validators.required]],
    });
    listFood:Alimento[] = [];
   
    items: any[] | undefined;
    selectedStatus: string = 'active';
    filteredItems: any[] | undefined;
    
    filterItems(event: AutoCompleteCompleteEvent) {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.items as any[]).length; i++) {
            let item = (this.items as any[])[i];
            if (item.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(item);
            }
        }

        this.filteredItems = filtered;
    }

  
    ngOnInit() {
         this.foodService.loadButtons('form');  
          
    }
  

    ngAfterContentInit(): void {
        this.formRegister.statusChanges.subscribe((res) => {
            if (res === 'INVALID') {
                this.registerService.buttonState('disabled', 'salvar', false);
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
