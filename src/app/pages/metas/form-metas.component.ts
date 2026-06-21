import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PageHeaderComponent } from '../../components/shared/page-header/page-header.component';
import { GoalService } from '../../service/metas.service';

@Component({
    selector: 'app-form-metas',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputNumberModule,
              DatePickerModule, ConfirmDialogModule, PageHeaderComponent],
    providers: [DatePipe],
    templateUrl: './form-metas.component.html',
})
export class FormMetasComponent implements OnInit {
    private readonly service = inject(GoalService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly datePipe = inject(DatePipe);

    isEdit = signal(false);

    form = new FormGroup({
        id: new FormControl<number | undefined>(undefined),
        data: new FormControl<Date | null>(null),
        meta_calorias: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        meta_proteinas: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        meta_carboidratos: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        meta_gorduras: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    });

    ngOnInit() {
        this.service.loadButtons('form');

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit.set(true);
            this.service.loadGoal(+id).subscribe();
            this.service.obsLoadGoal
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(data => {
                    const parsed = { ...data, data: data.data ? new Date(data.data) : null };
                    this.form.patchValue(parsed);
                    this.service.buttonState('visible', 'excluir', true);
                });
        }

        this.form.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(val => {
                const formatted = {
                    ...val,
                    data: val.data ? this.datePipe.transform(val.data, 'yyyy-MM-dd') : undefined,
                };
                this.service.setformGoal(formatted as any);
                this.service.buttonState('disabled', 'salvar', !this.form.valid);
            });

        this.service.obsSaveGoal
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigate(['/metas']));

        this.service.obsDeleteGoal
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigate(['/metas']));
    }
}
