import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Button } from '../api/button';
import { filter } from 'rxjs';
import { ActionButton } from '../api/action-button';
import { BarButton } from '../api/bar-button';
import { BarButtonsService } from '../../service/bar-buttons.service';

@Component({
    selector: 'app-bar-buttons',
    templateUrl: './bar-buttons.component.html',
})
export class BarButtonsComponent implements OnInit {
    keyService!: string;
    private _buttons: Button[] = [];
    items: MenuItem[] = [];
    quantidadeButtons: number = 0;

    @Input() tamPag: number = 0;

    set buttons(values: Button[]) {
        this._buttons = values;
        this.items = values;
    }
    get buttons() {
        return this._buttons;
    }

    constructor(private service: BarButtonsService, private router: Router) {
        this.service.loadButtons.subscribe((res: BarButton) => {
            this.keyService = res.keyService;
            this.buttons = res.buttons;
        });
    }

    ngOnInit(): void {
        this.tamPag = window.innerWidth;

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.keyService = '';
                this.buttons = [];
            });
    }

    actionButton(button: any) {
        if (!button.routerLink.length) {
            let actionButton: ActionButton;
            actionButton = {
                keyService: this.keyService,
                actionButton: button.title,
            };
            this.service.startActionButton(actionButton);
        }
    }
}
