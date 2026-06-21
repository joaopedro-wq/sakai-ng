import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-auth-card',
    standalone: true,
    imports: [AppFloatingConfigurator, NgClass],
    templateUrl: './auth-card.component.html',
    styleUrl: './auth-card.component.scss'
})
export class AuthCardComponent {
    subtitle = input<string>('');
    hint = input<string | undefined>(undefined);
    maxWidth = input<string>('480px');
    paddingY = input<string>('py-16');

    readonly currentYear = new Date().getFullYear();
}
