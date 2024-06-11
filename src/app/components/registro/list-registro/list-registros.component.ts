import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';

import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { Alimento } from 'src/app/api/alimento';
import { Refeicao } from 'src/app/api/refeicao';
import { Registro } from 'src/app/api/registro';
import { FoodService } from 'src/app/service/alimento.service';
import { SnackService } from 'src/app/service/refeicao.service';
import { RegisterService } from 'src/app/service/registro.service';

@Component({
    templateUrl: './list-registros.component.html',
    providers: [ConfirmationService],
})
export class ListRegistrosComponent implements OnInit, OnDestroy {
    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('op') overlayPanel!: OverlayPanel;
    private unsubscribe = new Subject<void>();
    food: Alimento[] = [];
    register: Registro[]= [];
    listSnackies!: Refeicao[];

    constructor(
        private router: Router,
        public foodService: FoodService,
        public snackService: SnackService,

        public registerService: RegisterService
    ) {
        this.registerService.obsListRegister
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.register = res;
            });
            this.snackService.obsListSnacks
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.listSnackies = res;
            });


            this.sortOptions = [
                { label: 'Data Ascendente', value: 'asc' },
                { label: 'Data Descendente', value: 'desc' }
            ];
            this.selectedSortOption = 'asc'; 
    }

    ngOnInit() {
        this.registerService.loadButtons('list');
        
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    
    navigateToCompanyEdit(id: number) {
        this.router.navigate([`/registros/registro/${id}`]);
    }

    getAlimentosDescription(alimentos: any[]): string {
        const descriptions = alimentos.map(alimento => alimento.descricao);
        const descriptionsWithBreaks = descriptions.map(desc => desc + '<br>');
        return descriptionsWithBreaks.join('');
    }
    
    sortOptions: any[];
    selectedSortOption: string;


    modalOrdenacao: boolean = false;
  

   

    onSortChange(event: any) {
        this.sortRegistersByDate(event.value);
    }

    sortRegistersByDate(order: string) {
        this.register.sort((a, b) => {
            const dateA = new Date(a.data).getTime();
            const dateB = new Date(b.data).getTime();
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
        

    }

    

}
