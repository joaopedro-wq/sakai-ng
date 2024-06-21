import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { User } from '../api/user';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { SnackService } from '../service/refeicao.service';
import { Refeicao } from '../api/refeicao';
import { Registro } from '../api/registro';
import { RegisterService } from '../service/registro.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    loggedUser!: User;
    avatarUrl: string = '';
    private unsubscribe = new Subject<void>();
    @ViewChild('overlayPanel') overlayPanel: OverlayPanel;
    notifications: string[] = [];
    snack: Refeicao[] = [];
    register: Registro[] = [];
    todayRegisters: Registro[] = [];
    constructor(
        public layoutService: LayoutService,
        public el: ElementRef,
        private authService: AuthService,
        public snackService: SnackService,
        public registerService: RegisterService,

        private router: Router
    ) {
        this.authService.obsGetLoggedUser
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                console.log('res', res);
                this.loggedUser = res;
                this.avatarUrl = res.avatar
                    ? res.avatar
                    : 'assets/default-profile.png';
            });
        this.snackService.obsListSnacks
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.snack = res;
                this.getLateMeals();
                this.filterTodayRegisters();
            });
        this.registerService.obsListRegister
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.register = res;
                this.filterTodayRegisters();

                this.getLateMeals();
            });
    }

    ngOnInit() {
        this.avatarUrl = this.getUserAvatar();
    }

    navigateToProfile() {
        this.router.navigate(['/profile']);
    }

    onLogout() {
        this.authService.logout().subscribe();
    }

    getUserAvatar(): string {
        if (this.authService.loggedUser && this.authService.loggedUser.avatar) {
            console.log('entrei', this.authService.loggedUser.avatar);
            return this.authService.loggedUser.avatar;
        } else {
            return 'assets/default-profile.png';
        }
    }
    clearNotifications() {
        this.notifications = [];
    }

    getLateMeals(): any[] {
        const currentTime = new Date();
        const currentHours = currentTime.getHours();

        const lateMeals = this.snack.filter((snack) => {
            const snackHour = parseInt(snack.horario.split(':')[0]);

            return snackHour < currentHours;
        });

        const filteredLateMeals = [];
        for (const index of lateMeals) {
            for (const index2 of this.todayRegisters) {
                if (index2.descricao_refeicao !== index.descricao) {
                    const filteredIndex = index;
                    filteredLateMeals.push(filteredIndex);
                }
            }
        }
        console.log('final', filteredLateMeals);
        this.notifications = filteredLateMeals.map(
            (descricao) => `Refeição ${descricao.descricao} não cadastrada.`
        );
        console.log('this.notifications', this.notifications);
        return filteredLateMeals;
    }

    filterTodayRegisters() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayFormatted = yesterday.toLocaleDateString();

        this.todayRegisters = this.register.filter((r) => {
            const registerDate = new Date(r.data);
            const registerFormatted = registerDate.toLocaleDateString();
            return yesterdayFormatted === registerFormatted;
        });

        console.log('this.todayRegisters', this.todayRegisters);
        this.todayRegisters.forEach((register) => (register.checked = true));
    }
}
