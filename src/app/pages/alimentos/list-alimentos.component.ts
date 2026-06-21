import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PageHeaderComponent } from '../../components/shared/page-header/page-header.component';
import { FoodService } from '../../service/alimento.service';
import { Alimento } from '../../api/alimento';

@Component({
    selector: 'app-list-alimentos',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, PageHeaderComponent],
    templateUrl: './list-alimentos.component.html',
})
export class ListAlimentosComponent implements OnInit {
    private readonly service = inject(FoodService);
    private readonly destroyRef = inject(DestroyRef);

    items = signal<Alimento[]>([]);
    loading = signal(false);

    ngOnInit() {
        this.service.loadButtons('list');

        this.loading.set(true);
        this.service.loadFoods().subscribe({ complete: () => this.loading.set(false) });

        this.service.obsListFoods
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(items => this.items.set(items));

        this.service.obsSaveFood
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.service.loadFoods().subscribe());

        this.service.obsDeleteFood
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.service.loadFoods().subscribe());
    }
}
