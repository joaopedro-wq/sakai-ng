import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PageHeaderComponent } from '../../components/shared/page-header/page-header.component';
import { GoalService } from '../../service/metas.service';
import { Metas } from '../../api/metas';

@Component({
    selector: 'app-list-metas',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, PageHeaderComponent],
    providers: [DatePipe],
    templateUrl: './list-metas.component.html',
})
export class ListMetasComponent implements OnInit {
    private readonly service = inject(GoalService);
    private readonly destroyRef = inject(DestroyRef);

    items = signal<Metas[]>([]);
    loading = signal(false);

    ngOnInit() {
        this.service.loadButtons('list');

        this.loading.set(true);
        this.service.loadGoals().subscribe({ complete: () => this.loading.set(false) });

        this.service.obsListGoal
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(items => {
                this.items.set(items);
                this.service.updateCadastrarButtonVisibility();
            });

        this.service.obsSaveGoal
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.service.loadGoals().subscribe());

        this.service.obsDeleteGoal
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.service.loadGoals().subscribe());
    }
}
