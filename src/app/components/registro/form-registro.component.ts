import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from '../../shared/shared.module';
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
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule,
              DatePickerModule, SelectModule, MultiSelectModule, ConfirmDialogModule, SharedModule],
    providers: [DatePipe],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-6">
                <h2 class="section-title text-xl">{{ isEdit() ? 'Editar' : 'Novo' }} Registro</h2>
                <app-bar-buttons></app-bar-buttons>
            </div>
            <form [formGroup]="form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Data *</label>
                    <p-datepicker formControlName="data" dateFormat="dd/mm/yy"
                                  placeholder="Selecione a data" styleClass="w-full" />
                    @if (form.get('data')?.invalid && form.get('data')?.touched) {
                        <small class="text-red-500">Data é obrigatória.</small>
                    }
                </div>
                <div class="flex flex-col gap-1">
                    <label class="font-medium text-sm">Refeição *</label>
                    <p-select formControlName="id_refeicao"
                              [options]="refeicoes()"
                              optionLabel="descricao"
                              optionValue="id"
                              placeholder="Selecione a refeição"
                              styleClass="w-full" />
                    @if (form.get('id_refeicao')?.invalid && form.get('id_refeicao')?.touched) {
                        <small class="text-red-500">Refeição é obrigatória.</small>
                    }
                </div>
                <div class="col-span-1 md:col-span-2 flex flex-col gap-1">
                    <label class="font-medium text-sm">Dieta (opcional — preenche alimentos automaticamente)</label>
                    <p-select [options]="dietas()"
                              optionLabel="descricao"
                              optionValue="id"
                              placeholder="Selecione uma dieta"
                              [showClear]="true"
                              (onChange)="onDietaChange($event.value)"
                              styleClass="w-full" />
                </div>
                <div class="col-span-1 md:col-span-2 flex flex-col gap-1">
                    <label class="font-medium text-sm">Alimentos *</label>
                    <p-multiselect [options]="todosAlimentos()"
                                   [(ngModel)]="selectedAlimentos"
                                   [ngModelOptions]="{ standalone: true }"
                                   optionLabel="descricao"
                                   placeholder="Selecione os alimentos"
                                   [filter]="true"
                                   filterPlaceholder="Buscar alimento..."
                                   (onChange)="onAlimentoChange()"
                                   styleClass="w-full" />
                </div>
            </form>

            @if (selectedAlimentos.length > 0) {
                <div class="mt-4">
                    <h3 class="section-title text-base mb-3">Quantidade consumida por Alimento</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        @for (alimento of selectedAlimentos; track alimento.id) {
                            <div class="flex items-center gap-3 p-3 rounded-lg border border-surface-200 dark:border-surface-700">
                                <div class="flex-1">
                                    <p class="font-medium text-sm mb-0">{{ alimento.descricao }}</p>
                                    <p class="text-xs text-muted-color mb-0">
                                        <span class="badge-nutrient badge-protein mr-1">P: {{ alimento.proteina }}g</span>
                                        <span class="badge-nutrient badge-fat mr-1">G: {{ alimento.gordura }}g</span>
                                        <span class="badge-nutrient badge-carb mr-1">C: {{ alimento.carbo }}g</span>
                                        <span class="badge-nutrient badge-calorie">{{ alimento.caloria }} kcal</span>
                                        <em class="ml-1 text-muted-color">(por {{ alimento.qtd }}g)</em>
                                    </p>
                                </div>
                                <p-inputnumber [ngModel]="getQtd(alimento.id!)"
                                               [ngModelOptions]="{ standalone: true }"
                                               (ngModelChange)="setQtd(alimento.id!, $event)"
                                               [min]="1" [max]="9999"
                                               suffix=" g"
                                               [style]="{ width: '110px' }" />
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
        <p-confirmDialog></p-confirmDialog>
    `
})
export class FormRegistroComponent implements OnInit {
    private readonly service = inject(RegisterService);
    private readonly snackService = inject(SnackService);
    private readonly dietService = inject(DietService);
    private readonly foodService = inject(FoodService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly datePipe = inject(DatePipe);

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
                    this.form.patchValue({
                        id: data.id,
                        data: data.data ? new Date(data.data) : null,
                        id_refeicao: data.id_refeicao,
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

    onDietaChange(dietaId: number | null) {
        if (!dietaId) return;
        const dieta = this.dietas().find(d => d.id === dietaId);
        if (dieta?.alimentos?.length) {
            this.selectedAlimentos = [...dieta.alimentos];
            this.selectedAlimentos.forEach(a => this.qtdMap.set(a.id!, a.pivot?.qtd ?? a.qtd ?? 100));
            this.syncServiceForm();
        }
    }

    onAlimentoChange() {
        this.selectedAlimentos.forEach(a => {
            if (!this.qtdMap.has(a.id!)) this.qtdMap.set(a.id!, a.qtd ?? 100);
        });
        this.syncServiceForm();
    }

    getQtd(id: number): number {
        return this.qtdMap.get(id) ?? 100;
    }

    setQtd(id: number, value: number) {
        this.qtdMap.set(id, value ?? 1);
        this.syncServiceForm();
    }

    private syncServiceForm() {
        const base = this.form.getRawValue();
        const data = base.data ? this.datePipe.transform(base.data, 'yyyy-MM-dd')! : '';
        const alimentos = this.selectedAlimentos.map(a => ({
            ...a,
            qtd: this.qtdMap.get(a.id!) ?? a.qtd ?? 100,
        }));
        this.service.setformFood({ ...base, data, alimentos } as any);
        const isValid = this.form.valid && this.selectedAlimentos.length > 0;
        this.service.buttonState('disabled', 'salvar', !isValid);
    }
}
