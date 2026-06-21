import { Component, OnInit, inject, signal, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

import { UserService, UserProfile } from '@/app/service/user.service';
import { InputImagemComponent } from '../../shared/components/input-imagem/input-imagem.component';
import { SharedModule } from '@/app/shared/shared.module';
import { BarButtonsService } from '@/app/shared/service/bar-buttons.service';
import { BarButton } from '@/app/shared/components/api/bar-button';
import { Button } from '@/app/shared/components/api/button';
import { ActionButton } from '@/app/shared/components/api/action-button';

interface SelectOption {
    label: string;
    value: string;
}

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        ButtonModule,
        Toast,
        ProgressSpinnerModule,
        InputImagemComponent,
        SharedModule,
    ],
    providers: [MessageService],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfileComponent implements OnInit {

    form!: FormGroup;

    // ─── Estado ───────────────────────────────────────────────────────────────
    profile       = signal<UserProfile | null>(null);
    loadingProfile = signal<boolean>(true);
    loadError     = signal<string | null>(null);
    saving        = signal<boolean>(false);
    avatarFile    = signal<File | null>(null);

    // ─── IMC computed ─────────────────────────────────────────────────────────
    imc = computed<number | null>(() => {
        const peso   = this.form?.get('peso')?.value;
        const altura = this.form?.get('altura')?.value;
        if (!peso || !altura || altura === 0) return null;
        const alturaM = altura / 100;
        return Math.round((peso / (alturaM * alturaM)) * 10) / 10;
    });

    imcLabel = computed<string>(() => {
        const v = this.imc();
        if (v === null) return '';
        if (v < 18.5) return 'Abaixo do peso';
        if (v < 25)   return 'Peso normal';
        if (v < 30)   return 'Sobrepeso';
        if (v < 35)   return 'Obesidade I';
        if (v < 40)   return 'Obesidade II';
        return 'Obesidade III';
    });

    imcBadgeStyle = computed<string>(() => {
        const v = this.imc();
        if (v === null) return '';
        if (v < 18.5) return 'background: color-mix(in srgb, var(--blue-400) 15%, transparent); color: var(--blue-400)';
        if (v < 25)   return 'background: color-mix(in srgb, var(--green-400) 15%, transparent); color: var(--green-400)';
        if (v < 30)   return 'background: color-mix(in srgb, var(--yellow-400) 15%, transparent); color: var(--yellow-400)';
        return 'background: color-mix(in srgb, var(--red-400) 15%, transparent); color: var(--red-400)';
    });

    imcColor = computed<string>(() => {
        const v = this.imc();
        if (v === null) return 'var(--surface-border)';
        if (v < 18.5) return 'var(--blue-400)';
        if (v < 25)   return 'var(--green-400)';
        if (v < 30)   return 'var(--yellow-400)';
        return 'var(--red-400)';
    });

    bodyStats = computed<{ label: string; value: string }[]>(() => {
        const p = this.form?.get('peso')?.value;
        const a = this.form?.get('altura')?.value;
        return [
            { label: 'Peso', value: p ? `${p} kg` : '—' },
            { label: 'Altura', value: a ? `${a} cm` : '—' },
        ];
    });

    // ─── Opções de select ─────────────────────────────────────────────────────
    generoOptions: SelectOption[] = [
        { label: 'Masculino',        value: 'masculino' },
        { label: 'Feminino',         value: 'feminino' },
        { label: 'Não-binário',      value: 'nao_binario' },
        { label: 'Prefiro não dizer', value: 'outro' },
    ];

    nivelAtividadeOptions: SelectOption[] = [
        { label: 'Sedentário',               value: 'sedentario' },
        { label: 'Levemente ativo',          value: 'levemente_ativo' },
        { label: 'Moderadamente ativo',      value: 'moderadamente_ativo' },
        { label: 'Muito ativo',              value: 'muito_ativo' },
        { label: 'Extremamente ativo',       value: 'extremamente_ativo' },
    ];

    objetivoOptions: SelectOption[] = [
        { label: 'Perder peso',              value: 'perder_peso' },
        { label: 'Manter peso',              value: 'manter_peso' },
        { label: 'Ganhar massa muscular',    value: 'ganhar_massa' },
        { label: 'Melhorar condicionamento', value: 'condicionamento' },
        { label: 'Saúde geral',              value: 'saude_geral' },
    ];

    private readonly fb             = inject(FormBuilder);
    private readonly userService    = inject(UserService);
    private readonly messageService = inject(MessageService);
    private readonly router         = inject(Router);
    private readonly barButtonsService = inject(BarButtonsService);

    // ─── Bar Buttons ──────────────────────────────────────────────────────────
    private readonly btSalvar: Button = {
        title: 'salvar', label: 'Salvar', id: 'profile_salvar',
        visible: true, disabled: false, loading: false,
        class: 'p-button', icon: 'pi pi-save',
        routerLink: [], tooltip: 'Salvar alterações do perfil',
    };

    private readonly btDescartar: Button = {
        title: 'descartar', label: 'Descartar', id: 'profile_descartar',
        visible: true, disabled: false, loading: false,
        class: 'p-button-outlined p-button-secondary', icon: 'pi pi-undo',
        routerLink: [], tooltip: 'Descartar alterações e restaurar dados salvos',
    };

    private readonly barConfig: BarButton = {
        keyService: 'ProfileComponent',
        buttons: [this.btSalvar],
    };

    ngOnInit(): void {
        this.buildForm();
        this.loadProfile();
        this.barButtonsService.startBarraButtons(this.barConfig);
        this.barButtonsService.execActionButton.subscribe((res: ActionButton) => {
            if (res.keyService === 'ProfileComponent') {
                if (res.actionButton === 'salvar')    this.onSubmit();
                if (res.actionButton === 'descartar') this.onCancel();
            }
        });
    }

    loadProfile(): void {
        const id = this.userService.getStoredUserId();
        if (!id) {
            this.loadError.set('Sessão não encontrada. Faça login novamente.');
            this.loadingProfile.set(false);
            return;
        }

        this.loadingProfile.set(true);
        this.loadError.set(null);

        this.userService.getById(id).subscribe({
            next: (user) => {
                this.profile.set(user);
                this.patchForm(user);
                this.loadingProfile.set(false);
            },
            error: (err: Error) => {
                this.loadError.set(err.message);
                this.loadingProfile.set(false);
            }
        });
    }

    onAvatarSelected(file: File | null): void {
        this.avatarFile.set(file);
    }

    isInvalid(field: string): boolean {
        const ctrl = this.form.get(field);
        return !!(ctrl?.invalid && (ctrl.dirty || ctrl.touched));
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const id = this.userService.getStoredUserId();
        if (!id) return;

        this.saving.set(true);
        this.btSalvar.disabled = true;
        this.btSalvar.loading  = true;
        this.btDescartar.disabled = true;
        this.barButtonsService.startBarraButtons(this.barConfig);
        const raw = this.form.value;

        this.userService.update(id, {
            name:             raw.name,
            email:            raw.email,
            genero:           raw.genero,
            peso:             raw.peso,
            altura:           raw.altura,
            data_nascimento:  this.formatDate(raw.data_nascimento),
            nivel_atividade:  raw.nivel_atividade,
            objetivo:         raw.objetivo,
            avatar:           this.avatarFile(),
        }).subscribe({
            next: (updated) => {
                this.profile.set(updated);
                if (updated.avatar) localStorage.setItem('avatar', updated.avatar);
                this.saving.set(false);
                this.btSalvar.disabled  = false;
                this.btSalvar.loading   = false;
                this.btDescartar.disabled = false;
                this.barButtonsService.startBarraButtons(this.barConfig);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Perfil atualizado',
                    detail: 'Suas informações foram salvas com sucesso.',
                    life: 4000,
                });
                this.avatarFile.set(null);
            },
            error: (err: Error) => {
                this.saving.set(false);
                this.btSalvar.disabled  = false;
                this.btSalvar.loading   = false;
                this.btDescartar.disabled = false;
                this.barButtonsService.startBarraButtons(this.barConfig);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro ao salvar',
                    detail: err.message,
                    life: 6000,
                });
            }
        });
    }

    onCancel(): void {
        if (this.profile()) this.patchForm(this.profile()!);
        this.avatarFile.set(null);
    }

    // ─── Privado ──────────────────────────────────────────────────────────────

    private buildForm(): void {
        this.form = this.fb.group({
            name:            ['', [Validators.required, Validators.minLength(2)]],
            email:           ['', [Validators.required, Validators.email]],
            genero:          [null],
            data_nascimento: [null],
            peso:            [null],
            altura:          [null],
            nivel_atividade: [null],
            objetivo:        [null],
        });
    }

    private patchForm(user: UserProfile): void {
        this.form.patchValue({
            name:            user.name,
            email:           user.email,
            genero:          user.genero ?? null,
            data_nascimento: user.data_nascimento ? new Date(user.data_nascimento) : null,
            peso:            user.peso ?? null,
            altura:          user.altura ?? null,
            nivel_atividade: user.nivel_atividade ?? null,
            objetivo:        user.objetivo ?? null,
        });
    }

    private formatDate(date: Date | string | null): string | null {
        if (!date) return null;
        const d = date instanceof Date ? date : new Date(date);
        if (Number.isNaN(d.getTime())) return null;
        return d.toISOString().split('T')[0];     // yyyy-mm-dd para o Laravel
    }
}
