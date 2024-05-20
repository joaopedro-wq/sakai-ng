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
import { FoodService } from 'src/app/service/alimento.service';

@Component({
    templateUrl: './list-alimentos.component.html',
    providers: [ConfirmationService],
})
export class ListAlimentosComponent implements OnInit, OnDestroy {
    @ViewChild('filter') filter!: ElementRef;

    private unsubscribe = new Subject<void>();
    food: Alimento[] = [];

    constructor(private router: Router, public foodService: FoodService) {
        this.foodService.obsListFood
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.food = res;
              
              
            });
    }

   
    ngOnInit() {
         this.foodService.loadButtons('list'); 
        
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

    /*  deleteCompany(id: number) {
        this.categoryService.deleteCategory(id).subscribe(() => {});
    } */

    navigateToCompanyEdit(id: number) {
        this.router.navigate([`/categories/register/${id}`]);
    }
}
