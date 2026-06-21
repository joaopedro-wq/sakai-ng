import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { PageHeaderComponent } from '../../components/shared/page-header/page-header.component';
import { RegisterService } from '../../service/registro.service';
import { Registro } from '../../api/registro';

@Component({
    selector: 'app-list-registro',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, RouterModule, TableModule, ButtonModule,
              DatePickerModule, DialogModule, PageHeaderComponent],
    templateUrl: './list-registro.component.html',
})
export class ListRegistroComponent implements OnInit {
    readonly service = inject(RegisterService);
    private readonly destroyRef = inject(DestroyRef);

    items = signal<Registro[]>([]);
    loading = signal(false);
    startDate: Date | null = null;
    endDate: Date | null = null;

    ngOnInit() {
        this.service.loadButtons('dashboard');

        this.loading.set(true);
        this.service.loadRegisters().subscribe({ complete: () => this.loading.set(false) });

        this.service.obsListRegister
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(items => this.items.set(items));

        this.service.obsSaveRegister
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.service.loadRegisters().subscribe());

        this.service.obsDeleteRegister
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.service.loadRegisters().subscribe());
    }

    exportExcel() {
        this.service.generateExcelByDate(this.startDate, this.endDate);
        this.service.modalExportExcel = false;
    }

    exportPdf() {
        this.service.generatePDFByDate(this.startDate, this.endDate);
        this.service.modalExportPdf = false;
    }
}
