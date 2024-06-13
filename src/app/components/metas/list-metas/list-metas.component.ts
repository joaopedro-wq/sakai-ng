import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { Alimento } from 'src/app/api/alimento';
import { Metas } from 'src/app/api/metas';
import { Registro } from 'src/app/api/registro';
import { FoodService } from 'src/app/service/alimento.service';
import { GoalService } from 'src/app/service/metas.service';
import { RegisterService } from 'src/app/service/registro.service';

@Component({
    templateUrl: './list-metas.component.html',
    providers: [ConfirmationService],
})
export class ListMetasComponent implements OnInit, OnDestroy {
    @ViewChild('filter') filter!: Table;
    private unsubscribe = new Subject<void>();
    food: Alimento[] = [];
    register: Registro[] = [];
    goal: Metas[] = [];
    position: string = 'top';
    selectedDate: string = ''; // Data inicial para exibir as metas
    selectedFilterDate: Date = new Date(); // Data selecionada no modal de filtro

    constructor(
        private router: Router,
        public foodService: FoodService,
        public goalService: GoalService,
        public registerService: RegisterService,
        private confirmationService: ConfirmationService
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

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    navigateToCompanyEdit(id: number) {
        this.router.navigate([`/metas/registro/${id}`]);
    }

    setSelectedDate() {
        // Define a data mais recente para exibir as metas
        if (this.register.length > 0) {
            const sortedRegisters = [...this.register].sort(
                (a, b) =>
                    new Date(b.data).getTime() - new Date(a.data).getTime()
            );
            this.selectedDate = new Date(sortedRegisters[0].data)
                .toISOString()
                .split('T')[0];
        }
    }

    getTotalCalories(): number {
        // Retorna as calorias consumidas na data selecionada
        const registersForDate = this.register.filter(
            (register) =>
                new Date(register.data).toISOString().split('T')[0] ===
                this.selectedDate
        );
        const totalCalories = registersForDate.reduce(
            (total, register) => total + register.nutrientes_totais.caloria,
            0
        );
        return parseFloat(totalCalories.toFixed(2));
    }

    getTotalProteins(): number {
        // Retorna as proteínas consumidas na data selecionada
        const registersForDate = this.register.filter(
            (register) =>
                new Date(register.data).toISOString().split('T')[0] ===
                this.selectedDate
        );
        const totalProteins = registersForDate.reduce(
            (total, register) => total + register.nutrientes_totais.proteina,
            0
        );
        return parseFloat(totalProteins.toFixed(2));
    }

    getTotalCarbo(): number {
        // Retorna os carboidratos consumidos na data selecionada
        const registersForDate = this.register.filter(
            (register) =>
                new Date(register.data).toISOString().split('T')[0] ===
                this.selectedDate
        );
        const totalCarbo = registersForDate.reduce(
            (total, register) => total + register.nutrientes_totais.carbo,
            0
        );
        return parseFloat(totalCarbo.toFixed(2));
    }

    getTotalFats(): number {
        // Retorna as gorduras consumidas na data selecionada
        const registersForDate = this.register.filter(
            (register) =>
                new Date(register.data).toISOString().split('T')[0] ===
                this.selectedDate
        );
        const totalFats = registersForDate.reduce(
            (total, register) => total + register.nutrientes_totais.gordura,
            0
        );
        return parseFloat(totalFats.toFixed(2));
    }

    applyFilter() {
        // Aplica o filtro de data selecionada
        this.selectedDate = this.selectedFilterDate.toISOString().split('T')[0];
        this.goalService.openModalFilter = false; 
        this.goalService.loadButtons('list');

    }

    closeModal() {
        // Fecha o modal sem aplicar o filtro
        this.goalService.openModalFilter = false;
    }
}
