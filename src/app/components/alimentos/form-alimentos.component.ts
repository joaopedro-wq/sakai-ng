import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { FoodService } from '../../service/alimento.service';

@Component({
    selector: 'app-form-alimentos',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule,
              ConfirmDialogModule, PageHeaderComponent],
    templateUrl: './form-alimentos.component.html',
})
export class FormAlimentosComponent implements OnInit {
    private readonly service = inject(FoodService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    isEdit = signal(false);

    form = new FormGroup({
        id: new FormControl<number | undefined>(undefined),
        descricao: new FormControl('', Validators.required),
        proteina: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        gordura: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        carbo: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        caloria: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
        qtd: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    });

    ngOnInit() {
        this.service.loadButtons('form');

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit.set(true);
            this.service.loadFood(+id).subscribe();
            this.service.obsLoadFood
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(data => {
                    this.form.patchValue(data);
                    this.service.buttonState('visible', 'excluir', true);
                });
        }

        this.form.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(val => {
                this.service.setformFood(val as any);
                this.service.buttonState('disabled', 'salvar', !this.form.valid);
            });

        this.service.obsSaveFood
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigate(['/alimentos']));

        this.service.obsDeleteFood
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigate(['/alimentos']));
    }
}
