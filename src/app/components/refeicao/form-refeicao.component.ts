import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { SnackService } from '../../service/refeicao.service';

@Component({
    selector: 'app-form-refeicao',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
              DatePickerModule, ConfirmDialogModule, PageHeaderComponent],
    templateUrl: './form-refeicao.component.html',
})
export class FormRefeicaoComponent implements OnInit {
    private readonly service = inject(SnackService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    isEdit = signal(false);

    form = new FormGroup({
        id: new FormControl<number | undefined>(undefined),
        descricao: new FormControl('', Validators.required),
        horario: new FormControl<Date | null>(null, Validators.required),
    });

    ngOnInit() {
        this.service.loadButtons('form');

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit.set(true);
            this.service.loadSnack(+id).subscribe();
            this.service.obsLoadSnack
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(data => {
                    const [h, m] = (data.horario as string).split(':');
                    const time = new Date();
                    time.setHours(+h, +m, 0, 0);
                    this.form.patchValue({ ...data, horario: time });
                    this.service.buttonState('visible', 'excluir', true);
                });
        }

        this.form.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(val => {
                this.service.setformSnack(val as any);
                this.service.buttonState('disabled', 'salvar', !this.form.valid);
            });

        this.service.obsSaveSnack
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigate(['/refeicoes']));

        this.service.obsDeleteSnack
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigate(['/refeicoes']));
    }
}
