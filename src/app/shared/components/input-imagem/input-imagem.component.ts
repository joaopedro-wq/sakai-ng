import {
    Component,
    ElementRef,
    OnInit,
    input,
    output,
    signal,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-input-imagem',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div
            class="input-imagem-root group relative flex flex-col items-center gap-3"
            (click)="openPicker()"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
            [class.ring-2]="isDragging()"
            [class.ring-[var(--primary-color)]]="isDragging()"
            style="cursor: pointer"
            role="button"
            tabindex="0"
            [attr.aria-label]="label()"
            (keydown.enter)="openPicker()"
            (keydown.space)="openPicker()"
        >
            <!-- Foto / placeholder -->
            <div
                class="relative overflow-hidden rounded-full transition-all duration-300"
                [style.width]="size() + 'px'"
                [style.height]="size() + 'px'"
            >
                <!-- Imagem atual ou preview -->
                @if (previewUrl()) {
                    <img
                        [src]="previewUrl()"
                        alt="Avatar"
                        class="h-full w-full object-cover"
                    />
                } @else {
                    <!-- Placeholder com gradiente usando cor primária -->
                    <div
                        class="flex h-full w-full items-center justify-center"
                        style="background: linear-gradient(135deg, color-mix(in srgb, var(--primary-color) 18%, transparent), color-mix(in srgb, var(--primary-color) 8%, transparent)); border: 2px dashed color-mix(in srgb, var(--primary-color) 35%, transparent)"
                    >
                        <i class="pi pi-user text-(--primary-color)" [style.font-size]="(size() * 0.38) + 'px'" style="opacity: 0.65"></i>
                    </div>
                }

                <!-- Overlay hover: ícone de câmera -->
                <div
                    class="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style="background: rgba(0,0,0,0.48)"
                >
                    <i class="pi pi-camera text-white" [style.font-size]="(size() * 0.24) + 'px'"></i>
                    <span class="text-xs font-medium text-white/90" [style.font-size]="(size() * 0.11) + 'px'">Alterar</span>
                </div>

                <!-- Anel primário decorativo -->
                <div
                    class="pointer-events-none absolute inset-0 rounded-full ring-2 ring-offset-2 transition-all duration-300 group-hover:ring-(--primary-color)"
                    style="ring-color: transparent; ring-offset-color: var(--surface-ground)"
                ></div>
            </div>

            <!-- Label e hint sob a foto -->
            <div class="flex flex-col items-center gap-0.5">
                <span class="text-sm font-semibold" style="color: var(--text-color)">{{ label() }}</span>
                <span class="text-xs" style="color: var(--text-color-secondary)">
                    {{ isDragging() ? 'Solte para enviar' : 'Clique ou arraste uma imagem' }}
                </span>
                @if (fileName()) {
                    <span
                        class="mt-1 flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium"
                        style="background: color-mix(in srgb, var(--primary-color) 12%, transparent); color: var(--primary-color)"
                    >
                        <i class="pi pi-image text-[10px]"></i>
                        {{ fileName() }}
                    </span>
                }
                <span class="text-[11px]" style="color: var(--text-color-secondary); opacity: 0.6">
                    JPEG, PNG, GIF · máx. 2MB
                </span>
            </div>

            <!-- Botão remover (aparece se há imagem selecionada ou existente) -->
            @if (previewUrl() && clearable()) {
                <button
                    type="button"
                    class="absolute -top-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-transform duration-150 hover:scale-110 active:scale-95"
                    style="background: var(--surface-card); border: 1.5px solid var(--surface-border); color: var(--text-color-secondary)"
                    (click)="onClear($event)"
                    aria-label="Remover imagem"
                >
                    <i class="pi pi-times text-[10px]"></i>
                </button>
            }
        </div>

        <!-- Input file oculto -->
        <input
            #fileInput
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/gif"
            class="hidden"
            (change)="onFileChange($event)"
        />
    `,
    styles: [`
        .input-imagem-root:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 4px;
            border-radius: 50%;
        }
    `]
})
export class InputImagemComponent implements OnInit {
    // ─── Inputs ───────────────────────────────────────────────────────────────
    /** URL do avatar atual (vinda do servidor) */
    currentUrl = input<string | null | undefined>(null);
    /** Tamanho (diâmetro) do círculo em px */
    size       = input<number>(120);
    /** Texto do label */
    label      = input<string>('Foto do perfil');
    /** Exibe botão de remover */
    clearable  = input<boolean>(true);

    // ─── Outputs ──────────────────────────────────────────────────────────────
    /** Emite o File selecionado ou `null` ao limpar */
    fileSelected = output<File | null>();

    // ─── Estado interno ───────────────────────────────────────────────────────
    previewUrl = signal<string | null>(null);
    fileName   = signal<string | null>(null);
    isDragging = signal<boolean>(false);

    @ViewChild('fileInput') private readonly fileInput!: ElementRef<HTMLInputElement>;

    ngOnInit(): void {
        // Exibe o avatar atual se existir
        if (this.currentUrl()) {
            this.previewUrl.set(this.currentUrl() ?? null);
        }
    }

    openPicker(): void {
        this.fileInput?.nativeElement.click();
    }

    onFileChange(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        this.processFile(file ?? null);
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(true);
    }

    onDragLeave(event: DragEvent): void {
        event.stopPropagation();
        this.isDragging.set(false);
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(false);
        const file = event.dataTransfer?.files?.[0];
        this.processFile(file ?? null);
    }

    onClear(event: MouseEvent): void {
        event.stopPropagation();
        this.previewUrl.set(this.currentUrl() ?? null);
        this.fileName.set(null);
        if (this.fileInput?.nativeElement) {
            this.fileInput.nativeElement.value = '';
        }
        this.fileSelected.emit(null);
    }

    // ─── Privado ──────────────────────────────────────────────────────────────

    private processFile(file: File | null): void {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            console.warn('[InputImagem] Arquivo não é imagem:', file.type);
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            console.warn('[InputImagem] Imagem excede 2MB:', file.size);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewUrl.set(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        this.fileName.set(file.name);
        this.fileSelected.emit(file);
    }
}
