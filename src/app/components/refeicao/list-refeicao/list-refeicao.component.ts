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
import { Refeicao } from 'src/app/api/refeicao';
import { SnackService } from 'src/app/service/refeicao.service';

@Component({
    templateUrl: './list-refeicao.component.html',
    providers: [ConfirmationService],
})
export class ListRefeicaoComponent implements OnInit, OnDestroy {
    @ViewChild('filter') filter!: ElementRef;

    private unsubscribe = new Subject<void>();
    snack: Refeicao[] = [];

    constructor(private router: Router, public snackService: SnackService) {
        this.snackService.obsListSnacks
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.snack = res;
                this.sortSnacksByTime();
            });
    }

    ngOnInit() {
        this.snackService.loadButtons('list');
    }

    formatarHorario(horario: string): string {
        return horario.slice(0, 5);
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
        this.router.navigate([`/refeicoes/registro/${id}`]);
    }

    sortSnacksByTime() {
        this.snack.sort((a, b) => {
            const [hoursA, minutesA, secondsA] = a.horario
                .split(':')
                .map(Number);
            const [hoursB, minutesB, secondsB] = b.horario
                .split(':')
                .map(Number);
            return (
                hoursA * 3600 +
                minutesA * 60 +
                (secondsA || 0) -
                (hoursB * 3600 + minutesB * 60 + (secondsB || 0))
            );
        });
    }
}
