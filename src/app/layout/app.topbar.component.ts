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
    avatarUrl: string = '';
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
                console.log('res',res)
                this.loggedUser = res;
                this.avatarUrl = res.avatar ? res.avatar : 'assets/default-profile.png';
            

            });
    }

   /*  ngOnInit() {
        this.avatarUrl = this.getUserAvatar();
    } */


    navigateToProfile() {
        this.router.navigate(['/profile']);
    }

    onLogout() {
        this.authService.logout().subscribe();
    }

    getUserAvatar(): string {
        if (this.authService.loggedUser && this.authService.loggedUser.avatar) {
          console.log('entrei', this.authService.loggedUser.avatar)
          return this.authService.loggedUser.avatar;
        } else {
          return 'assets/default-profile.png';
        }
      }
      
}
