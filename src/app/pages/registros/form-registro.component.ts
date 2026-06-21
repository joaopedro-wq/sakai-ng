import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PageHeaderComponent } from '../../components/shared/page-header/page-header.component';
import { AlimentoQtdListComponent } from '../../components/shared/alimento-qtd-list/alimento-qtd-list.component';
import { RegisterService } from '../../service/registro.service';
import { SnackService } from '../../service/refeicao.service';
import { DietService } from '../../service/dieta.service';
import { FoodService } from '../../service/alimento.service';
import { Refeicao } from '../../api/refeicao';
import { Dieta } from '../../api/dieta';
import { Alimento } from '../../api/alimento';

@Component({
    selector: 'app-form-registro',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule,
              SelectModule, MultiSelectModule, DatePickerModule, ConfirmDialogModule,
              PageHeaderComponent, AlimentoQtdListComponent],
    providers: [DatePipe],
    templateUrl: './form-registro.component.html',
})
export class FormRegistroComponent implements OnInit {
    private readonly service = inject(RegisterService);
    private readonly snackService = inject(SnackService);
    private readonly dietService = inject(DietService);
    private readonly foodService = inject(FoodService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    isEdit = signal(false);
    refeicoes = signal<Refeicao[]>([]);
    dietas = signal<Dieta[]>([]);
    todosAlimentos = signal<Alimento[]>([]);
    selectedAlimentos: Alimento[] = [];
    private qtdMap = new Map<number, number>();

    form = new FormGroup({
        id: new FormControl<number | undefined>(undefined),
        data: new FormControl<Date | null>(null, Validators.required),
        id_refeicao: new FormControl<number | null>(null, Validators.required),
        id_dieta: new FormControl<number | null>(null),
    });

    ngOnInit() {
        this.service.loadButtons('form');

        this.snackService.loadSnackies().subscribe();
        this.snackService.obsListSnacks
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(r => this.refeicoes.set(r));

        this.dietService.loadDiets().subscribe();
        this.dietService.obsListDiet
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(d => this.dietas.set(d));

        this.foodService.loadFoods().subscribe();
        this.foodService.obsListFoods
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(a => this.todosAlimentos.set(a));

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit.set(true);
            this.service.loadRegister(+id).subscribe();
            this.service.obsLoadRegister
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(data => {
                    const parsedData = data.data ? new Date(data.data as string) : null;
                    this.form.patchValue({
                        id: data.id,
                        data: parsedData,
                        id_refeicao: data.id_refeicao,
                        id_dieta: data.id_dieta,
                    });
                    this.selectedAlimentos = data.alimentos ?? [];
                    this.selectedAlimentos.forEach(a => this.qtdMap.set(a.id!, a.pivot?.qtd ?? a.qtd ?? 100));
                    this.service.buttonState('visible', 'excluir', true);
                    this.syncServiceForm();
                });
        }

        this.form.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.syncServiceForm());

        this.service.obsSaveRegister
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigate(['/registros']));

        this.service.obsDeleteRegister
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigate(['/registros']));
    }

    onDietaChange(idDieta: number | null) {
        if (!idDieta) return;
        const dieta = this.dietas().find(d => d.id === idDieta);
        if (dieta?.alimentos) {
            this.selectedAlimentos = dieta.alimentos;
            this.selectedAlimentos.forEach(a => {
                if (!this.qtdMap.has(a.id!)) this.qtdMap.set(a.id!, a.pivot?.qtd ?? a.qtd ?? 100);
            });
            this.syncServiceForm();
        }
    }

    onAlimentoChange() {
        this.selectedAlimentos.forEach(a => {
            if (!this.qtdMap.has(a.id!)) this.qtdMap.set(a.id!, a.qtd ?? 100);
        });
        this.syncServiceForm();
    }

    getQtd = (id: number): number => this.qtdMap.get(id) ?? 100;

    onQtdChange(event: { id: number; qtd: number }) {
        this.qtdMap.set(event.id, event.qtd);
        this.syncServiceForm();
    }

    private syncServiceForm() {
        const base = this.form.getRawValue();
        const alimentos = this.selectedAlimentos.map(a => ({
            ...a,
            qtd: this.qtdMap.get(a.id!) ?? a.qtd ?? 100,
        }));
        this.service.setformFood({ ...base, alimentos } as any);
        const isValid = this.form.valid && this.selectedAlimentos.length > 0;
        this.service.buttonState('disabled', 'salvar', !isValid);
    }
}
