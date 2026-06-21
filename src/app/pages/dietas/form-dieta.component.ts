import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PageHeaderComponent } from '../../components/shared/page-header/page-header.component';
import { AlimentoQtdListComponent } from '../../components/shared/alimento-qtd-list/alimento-qtd-list.component';
import { DietService } from '../../service/dieta.service';
import { SnackService } from '../../service/refeicao.service';
import { FoodService } from '../../service/alimento.service';
import { Refeicao } from '../../api/refeicao';
import { Alimento } from '../../api/alimento';

@Component({
    selector: 'app-form-dieta',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule,
              SelectModule, MultiSelectModule, ConfirmDialogModule,
              PageHeaderComponent, AlimentoQtdListComponent],
    templateUrl: './form-dieta.component.html',
})
export class FormDietaComponent implements OnInit {
    private readonly service = inject(DietService);
    private readonly snackService = inject(SnackService);
    private readonly foodService = inject(FoodService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    isEdit = signal(false);
    refeicoes = signal<Refeicao[]>([]);
    todosAlimentos = signal<Alimento[]>([]);
    selectedAlimentos: Alimento[] = [];
    private qtdMap = new Map<number, number>();

    form = new FormGroup({
        id: new FormControl<number | undefined>(undefined),
        descricao: new FormControl('', Validators.required),
        id_refeicao: new FormControl<number | null>(null, Validators.required),
    });

    ngOnInit() {
        this.service.loadButtons('form');

        this.snackService.loadSnackies().subscribe();
        this.snackService.obsListSnacks
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(r => this.refeicoes.set(r));

        this.foodService.loadFoods().subscribe();
        this.foodService.obsListFoods
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(a => this.todosAlimentos.set(a));

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit.set(true);
            this.service.loadDiet(+id).subscribe();
            this.service.obsLoadDiet
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(data => {
                    this.form.patchValue({ id: data.id, descricao: data.descricao, id_refeicao: data.id_refeicao });
                    this.selectedAlimentos = data.alimentos ?? [];
                    this.selectedAlimentos.forEach(a => this.qtdMap.set(a.id!, a.pivot?.qtd ?? a.qtd ?? 100));
                    this.service.buttonState('visible', 'excluir', true);
                    this.syncServiceForm();
                });
        }

        this.form.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.syncServiceForm());

        this.service.obsSaveDiet
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigate(['/dietas']));

        this.service.obsDeleteDiet
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigate(['/dietas']));
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
        this.service.setformDiet({ ...base, alimentos } as any);
        const isValid = this.form.valid && this.selectedAlimentos.length > 0;
        this.service.buttonState('disabled', 'salvar', !isValid);
    }
}
