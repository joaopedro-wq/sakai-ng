import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-profile',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="p-6">
            <h2 class="section-title text-xl mb-4">Meu Perfil</h2>
            <p class="text-muted-color">Em construção...</p>
        </div>
    `
})
export class ProfileComponent {}
