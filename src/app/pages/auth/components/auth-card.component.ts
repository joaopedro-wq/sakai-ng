import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-auth-card',
    standalone: true,
    imports: [AppFloatingConfigurator],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <app-floating-configurator />
        <div class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-4"
             [style.padding-top]="paddingY()" [style.padding-bottom]="paddingY()">

            <div class="w-full" [style.max-width]="maxWidth()">

                <!-- Logo / cabeçalho da marca -->
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-brand mb-4 shadow-lg">
                        <i class="pi pi-leaf text-white text-2xl"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-color mb-1">NutriAI</h1>
                    @if (subtitle()) {
                        <p class="text-sm text-muted-color">{{ subtitle() }}</p>
                    }
                </div>

                <!-- Card do formulário -->
                <div class="bg-surface-0 dark:bg-surface-900 rounded-2xl shadow-lg border border-surface p-8">
                    <ng-content />
                </div>

            </div>
        </div>
    `
})
export class AuthCardComponent {
    subtitle = input<string>('');
    maxWidth = input<string>('440px');
    paddingY = input<string>('2rem');
}
