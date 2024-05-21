import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { FoodService } from 'src/app/service/alimento.service';


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
        public foodService: FoodService
    ) {
        /* this.foodService.obsLoadFood
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.formFood.patchValue({
                    id: res.id ? res.id : null,
                    descricao: res.descricao,
                    proteina: res.proteina,
                    gordura: res.gordura,
                    carbo: res.carbo,
                    qtd: res.qtd,

                });
            }); */

    }
    
    public formFood: FormGroup = this.formBuilder.group({
        id: [null],
        descricao: ['', [Validators.required]],
        proteina: [ , [Validators.required]],
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
          this.breadcrumbItems = [];
            this.breadcrumbItems.push({ label: 'Alimentos' }); 
    }
  
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
       
    }
}
