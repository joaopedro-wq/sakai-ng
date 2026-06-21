# NutriAI — Guia de Desenvolvimento

Sistema de dietas personalizado com IA (Gemini). Angular 21 + PrimeNG 21 + Tailwind CSS 4.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Angular 21 standalone, zoneless |
| UI | PrimeNG 21 (Aura theme, emerald primary) |
| Estilos | SCSS + Tailwind CSS 4 |
| Estado | Angular Signals |
| HTTP | HttpClient + interceptors |
| Backend | Laravel + Sanctum (JWT) |
| IA | Google Gemini API |

---

## Padrões Angular 21

### Componentes — sempre standalone

```typescript
@Component({
  selector: 'app-exemplo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './exemplo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExemploComponent {
  // Injeção via inject() — não via construtor
  private readonly service = inject(ExemploService);
}
```

### Signals — state management moderno

```typescript
// Estado local reativo
count = signal(0);
doubled = computed(() => this.count() * 2);

// Estado derivado de HTTP
data = signal<Dieta[]>([]);

// Atualização imutável
this.data.update(list => [...list, novadieta]);
```

### Zoneless + ChangeDetection.OnPush

- **Todos os novos componentes** usam `ChangeDetectionStrategy.OnPush`
- O projeto usa `provideZonelessChangeDetection()` — não use `setTimeout` ou `setInterval` sem `NgZone`
- Use `signal()` e `computed()` para gatilhar re-renders automaticamente

### Formulários — Reactive Forms

```typescript
form = new FormGroup({
  descricao: new FormControl('', [Validators.required, Validators.minLength(3)]),
  calorias: new FormControl<number | null>(null, [Validators.min(0)]),
});
```

### Injeção de dependências

```typescript
// CORRETO — inject() no campo
private readonly dietaService = inject(DietaService);

// EVITAR — construtor longo
constructor(private dietaService: DietaService) {}
```

### Lazy loading de rotas

```typescript
{
  path: 'dietas',
  loadComponent: () => import('./components/dieta/list-dieta/list-dieta.component')
    .then(m => m.ListDietaComponent)
}
```

### Pipes e formatações

```typescript
// Pipe customizado standalone
@Pipe({ name: 'kcal', standalone: true, pure: true })
export class KcalPipe implements PipeTransform {
  transform(value: number): string {
    return `${value.toFixed(0)} kcal`;
  }
}
```

---

## Sistema de Cores

Paleta definida em `src/assets/layout/variables/_brand.scss`.

### Variáveis principais

```scss
/* Marca (Emerald — Saúde) */
var(--brand-500)      /* #10b981 — cor principal */
var(--brand-600)      /* #059669 — hover/dark */
var(--brand-50)       /* #ecfdf5 — fundo sutil */

/* Energia (Laranja — Calorias) */
var(--energy-500)     /* #f97316 */

/* Topbar */
var(--topbar-bg-from) /* gradiente início */
var(--topbar-bg-to)   /* gradiente fim */
var(--topbar-text-color)
```

### Cores de nutrientes

```scss
var(--nutrient-protein)   /* violeta — proteínas */
var(--nutrient-carb)      /* âmbar — carboidratos */
var(--nutrient-fat)       /* vermelho — gorduras */
var(--nutrient-fiber)     /* verde — fibras */
var(--nutrient-calorie)   /* laranja — calorias */
```

### Classes globais (use direto no HTML)

```html
<!-- Badges de nutrientes -->
<span class="badge-nutrient badge-protein">Proteína: 30g</span>
<span class="badge-nutrient badge-carb">Carbo: 50g</span>
<span class="badge-nutrient badge-fat">Gordura: 15g</span>
<span class="badge-nutrient badge-calorie">Kcal: 400</span>

<!-- Badge IA -->
<span class="badge-ai"><i class="pi pi-sparkles"></i> Gerado por IA</span>

<!-- Cards de métricas -->
<div class="metric-card">
  <div class="metric-value">1850</div>
  <div class="metric-label">Calorias</div>
</div>

<!-- Barra de progresso de nutriente -->
<div class="nutrient-bar nutrient-bar--protein">
  <div class="nutrient-bar__fill" [style.width.%]="percentProtein"></div>
</div>

<!-- Título de seção -->
<h3 class="section-title">Refeições do Dia</h3>

<!-- Card com borda gradiente IA -->
<div class="ai-diet-card">...</div>

<!-- Chip de alimento -->
<span class="food-chip">Frango grelhado 150g</span>

<!-- Panel de refeição -->
<div class="meal-panel">
  <div class="meal-panel__header">Café da Manhã — 07:00</div>
  <div class="meal-panel__body">...</div>
</div>
```

---

## Estrutura de Arquivos

```
src/
├── app/
│   ├── api/                    # Interfaces TypeScript (models)
│   │   ├── alimento.ts
│   │   ├── dieta.ts
│   │   ├── refeicao.ts
│   │   ├── registro.ts
│   │   └── metas.ts
│   ├── components/             # Features standalone
│   │   ├── dieta/
│   │   ├── alimentos/
│   │   ├── refeicao/
│   │   ├── registro/
│   │   ├── metas/
│   │   ├── relatorio/
│   │   └── profile/
│   ├── layout/
│   │   ├── component/          # Topbar, Sidebar, Menu, Footer
│   │   └── service/            # LayoutService (signals)
│   ├── service/                # Services de domínio
│   ├── interceptors/           # HTTP interceptors
│   └── shared/                 # Componentes e services reutilizáveis
├── assets/
│   └── layout/
│       ├── variables/
│       │   ├── _brand.scss     # Paleta de cores do projeto
│       │   ├── _common.scss    # Variáveis PrimeNG bridge
│       │   ├── _light.scss
│       │   └── _dark.scss
│       ├── _globals.scss       # Classes utilitárias globais
│       ├── _topbar.scss
│       └── layout.scss
└── styles.scss                 # Entry point de estilos
```

---

## PrimeNG 21 — Boas Práticas

### Imports standalone (não usar módulos se possível)

```typescript
// CORRETO
imports: [ButtonModule, InputTextModule, TableModule]

// Não importar AppModule inteiro
```

### Theme tokens — sempre via CSS variables

```html
<!-- NÃO hardcode hex -->
<div style="color: #10b981">texto</div>

<!-- SIM — variável semântica -->
<div style="color: var(--brand-500)">texto</div>
```

### Configuração de tema (app.config.ts)

```typescript
providePrimeNG({
  theme: {
    preset: Aura,
    options: { darkModeSelector: '.app-dark' }
  }
})
```

### Dark mode — toggle via classe no HTML element

```typescript
// LayoutService já faz isso:
document.documentElement.classList.toggle('app-dark', isDark);
```

---

## Integração IA — Gemini

### Serviço de IA para dietas

Criar `src/app/service/ia-dieta.service.ts`:

```typescript
@Injectable({ providedIn: 'root' })
export class IaDietaService {
  private readonly http = inject(HttpClient);

  // Endpoint no Laravel que chama Gemini
  gerarDieta(perfil: UserProfile): Observable<DietaGerada> {
    return this.http.post<DietaGerada>('/api/ia/gerar-dieta', { perfil });
  }

  analisarRefeicao(descricao: string): Observable<AnaliseNutricional> {
    return this.http.post<AnaliseNutricional>('/api/ia/analisar', { descricao });
  }
}
```

### Prompt padrão para geração de dieta

O prompt deve incluir: peso, altura, idade, gênero, nível de atividade, objetivo (emagrecer/ganhar massa/manter), preferências alimentares, restrições.

Retorno esperado do Gemini: JSON estruturado com refeições, alimentos, quantidades e macros.

---

## Responsividade

- Mobile first: estilos base para mobile, `md:` e `lg:` para desktop
- Breakpoints Tailwind: `sm` 640px | `md` 768px | `lg` 1024px | `xl` 1280px
- Layout principal: sidebar oculta em mobile (overlay), fixa em desktop
- Cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` para métricas
- Tabelas: scroll horizontal em mobile com `overflow-x-auto`

---

## Convenções

- Componentes em português para domínio (DiетaService, AlimentoComponent)
- Interfaces e DTOs em inglês ou camelCase brasileiro
- Arquivos: kebab-case (`list-dieta.component.ts`)
- Classe CSS: BEM para componentes layout, classes globais para utilitários
- Sem `console.log` em produção — usar serviço de log ou remover
- Sem comentários óbvios no código — apenas WHY, nunca WHAT
