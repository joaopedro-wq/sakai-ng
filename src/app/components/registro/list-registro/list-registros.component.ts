import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { Alimento } from 'src/app/api/alimento';
import { Registro } from 'src/app/api/registro';
import { FoodService } from 'src/app/service/alimento.service';
import { RegisterService } from 'src/app/service/registro.service';

@Component({
    templateUrl: './list-registros.component.html',
    providers: [ConfirmationService],
})
export class ListRegistrosComponent implements OnInit, OnDestroy {
    @ViewChild('filter') filter!: ElementRef;

    private unsubscribe = new Subject<void>();
    food: Alimento[] = [];
    register: Registro[]= [];
    constructor(
        private router: Router,
        public foodService: FoodService,
        public registerService: RegisterService
    ) {
        this.registerService.obsListRegister
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.register = res;
            });
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



}
