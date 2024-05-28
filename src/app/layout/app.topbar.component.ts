import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { User } from '../api/user';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    loggedUser!: User;

    private unsubscribe = new Subject<void>();

    constructor(
        public layoutService: LayoutService,
        public el: ElementRef,
        private authService: AuthService,
        private router: Router
    ) {
        this.authService.obsGetLoggedUser
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.loggedUser = res;
            });
    }

    navigateToProfile() {
        this.router.navigate(['/profile']);
    }

    onLogout() {
        this.authService.logout().subscribe();
    }
}
