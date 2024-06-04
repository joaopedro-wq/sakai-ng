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
import { Dieta } from 'src/app/api/dieta';
import { DietService } from 'src/app/service/dieta.service';

@Component({
    templateUrl: './list-dieta.component.html',
    providers: [ConfirmationService],
})
export class ListDietaComponent implements OnInit, OnDestroy {
    @ViewChild('filter') filter!: ElementRef;

    private unsubscribe = new Subject<void>();
    diet: Dieta[] = [];

    constructor(private router: Router, public dietService: DietService) {
        this.dietService.obsListDiet
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.diet = res;
              
              
            });
    }

   
    ngOnInit() {
         this.dietService.loadButtons('list'); 
        
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
        this.router.navigate([`/dietas/registro/${id}`]);
    }
}
