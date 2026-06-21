import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Principal',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Nutrição',
                items: [
                    { label: 'Alimentos', icon: 'pi pi-fw pi-apple', routerLink: ['/alimentos'] },
                    { label: 'Refeições', icon: 'pi pi-fw pi-clock', routerLink: ['/refeicoes'] },
                    { label: 'Dietas', icon: 'pi pi-fw pi-list', routerLink: ['/dietas'] },
                    { label: 'Registros', icon: 'pi pi-fw pi-calendar', routerLink: ['/registros'] },
                    { label: 'Metas', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/metas'] }
                ]
            },
            {
                label: 'Conta',
                items: [
                    { label: 'Perfil', icon: 'pi pi-fw pi-user', routerLink: ['/profile'] }
                ]
            }
        ];
    }
}
