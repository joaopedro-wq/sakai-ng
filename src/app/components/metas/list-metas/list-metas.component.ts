import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { Alimento } from 'src/app/api/alimento';
import { Metas } from 'src/app/api/metas';
import { Refeicao } from 'src/app/api/refeicao';
import { Registro } from 'src/app/api/registro';
import { FoodService } from 'src/app/service/alimento.service';
import { GoalService } from 'src/app/service/metas.service';
import { SnackService } from 'src/app/service/refeicao.service';
import { RegisterService } from 'src/app/service/registro.service';

@Component({
    templateUrl: './list-metas.component.html',
    providers: [ConfirmationService],
})
export class ListMetasComponent implements OnInit, OnDestroy {
    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('op') overlayPanel!: OverlayPanel;
    private unsubscribe = new Subject<void>();
    food: Alimento[] = [];
    register: Registro[] = [];
    goal: Metas[] = [];

    selectedDate: string = '';

    constructor(
        private router: Router,
        public foodService: FoodService,
        public goalService: GoalService,
        public registerService: RegisterService
    ) {
        this.goalService.obsListGoal
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.goal = res;
            });
        this.registerService.obsListRegister
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.register = res;
                this.setSelectedDate();
            });
    }

    ngOnInit() {
        this.goalService.loadButtons('list');
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
        this.router.navigate([`/metas/registro/${id}`]);
    }

    setSelectedDate() {
        if (this.register.length > 0) {
            // Sort the registers by date in descending order
            const sortedRegisters = [...this.register].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
            // Set the most recent date
            this.selectedDate = new Date(sortedRegisters[0].data).toISOString().split('T')[0];
        }
    }

    getTotalCalories(): number {
        const registersForDate = this.register.filter(register => new Date(register.data).toISOString().split('T')[0] === this.selectedDate);
        return registersForDate.reduce((total, register) => total + register.nutrientes_totais.caloria, 0);
    }

    getTotalProteins(): number {
        const registersForDate = this.register.filter(register => new Date(register.data).toISOString().split('T')[0] === this.selectedDate);
        return registersForDate.reduce((total, register) => total + register.nutrientes_totais.proteina, 0);
    }

    getTotalCarbohydrates(): number {
        const registersForDate = this.register.filter(register => new Date(register.data).toISOString().split('T')[0] === this.selectedDate);
        return registersForDate.reduce((total, register) => total + register.nutrientes_totais.carbo, 0);
    }

    getTotalFats(): number {
        const registersForDate = this.register.filter(register => new Date(register.data).toISOString().split('T')[0] === this.selectedDate);
        return registersForDate.reduce((total, register) => total + register.nutrientes_totais.gordura, 0);
    }
}
