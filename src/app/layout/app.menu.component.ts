import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Cadastro',
                items: [
                    { label: 'Refeição', icon: 'pi pi-server', routerLink: ['/refeicoes'] },
                ]
            },
            {
                label: 'Registro',
                items: [
                    { label: 'Alimentos', icon: 'pi pi-heart', routerLink: ['/alimentos'] },
                    { label: 'Registro Diário', icon: 'pi pi-bars', routerLink: ['/registros'] },


                ]
            },
            
        ];
    }
}
