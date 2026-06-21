import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PageHeaderComponent } from '../../components/shared/page-header/page-header.component';
import { DietService } from '../../service/dieta.service';
import { Dieta } from '../../api/dieta';

@Component({
    selector: 'app-list-dieta',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, PageHeaderComponent],
    templateUrl: './list-dieta.component.html',
})
export class ListDietaComponent implements OnInit {
    private readonly service = inject(DietService);
    private readonly destroyRef = inject(DestroyRef);

    items = signal<Dieta[]>([]);
    loading = signal(false);

    ngOnInit() {
        this.service.loadButtons('list');

        this.loading.set(true);
        this.service.loadDiets().subscribe({ complete: () => this.loading.set(false) });

        this.service.obsListDiet
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(items => this.items.set(items));

        this.service.obsSaveDiet
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.service.loadDiets().subscribe());

        this.service.obsDeleteDiet
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.service.loadDiets().subscribe());
    }
}
