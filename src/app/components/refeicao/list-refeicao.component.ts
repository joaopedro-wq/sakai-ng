import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { SnackService } from '../../service/refeicao.service';
import { Refeicao } from '../../api/refeicao';

@Component({
    selector: 'app-list-refeicao',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, PageHeaderComponent],
    templateUrl: './list-refeicao.component.html',
})
export class ListRefeicaoComponent implements OnInit {
    private readonly service = inject(SnackService);
    private readonly destroyRef = inject(DestroyRef);

    items = signal<Refeicao[]>([]);
    loading = signal(false);

    ngOnInit() {
        this.service.loadButtons('list');

        this.loading.set(true);
        this.service.loadSnackies().subscribe({ complete: () => this.loading.set(false) });

        this.service.obsListSnacks
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(items => this.items.set(items));

        this.service.obsSaveSnack
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.service.loadSnackies().subscribe());

        this.service.obsDeleteSnack
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.service.loadSnackies().subscribe());
    }
}
