import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
    items!: MenuItem[];
    @ViewChild('overlayPanel') overlayPanel: OverlayPanel;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    loggedUser!: User;
    avatarUrl: string = '';
    private unsubscribe = new Subject<void>();

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
        private formBuilder: FormBuilder,

        private router: Router
    ) {
        this.authService.obsGetLoggedUser
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
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

        this.authService.obsGetLoggedUser
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.formProfile.patchValue({
                    id: res.id ? res.id : null,
                    name: res.name,
                    email: res.email,
                    avatar: res.avatar,
                    data_nascimento: new Date(res.data_nascimento),
                });
            });
    }

    public formProfile: FormGroup = this.formBuilder.group({
        id: [null],
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        avatar: [''],
        peso: ['', [Validators.required]],
        genero: ['', [Validators.required]],
        altura: ['', [Validators.required]],
        nivel_atividade: ['', [Validators.required]],
        data_nascimento: [null, [Validators.required]],
        objetivo: [null, [Validators.required]],
    });
    menuItems: MenuItem[] = [
        {
            label: 'Configurações',
            icon: 'pi pi-cog',
            command: () => this.navigateToProfile(),
        },
        {
            label: 'Sair',
            icon: 'pi pi-power-off',
            command: () => this.onLogout(),
        },
    ];
    menuVisible: boolean = false;

    toggleMenu(event: Event) {
        event.preventDefault(); // Prevent default anchor behavior
        this.menuVisible = !this.menuVisible; // Toggle menu visibility
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.isMobile();
    }

    isMobile(): boolean {
        return window.innerWidth <= 991; 
    }
    ngOnInit() {
        this.avatarUrl =
            localStorage.getItem('avatar') || 'assets/default-profile.png';
    }
    navigateToProfile() {
        this.router.navigate(['/profile']);
    }

    onLogout() {
        this.authService.logout().subscribe();
    }

    getUserAvatar(): string {
        let avatarUrl = 'assets/default-profile.png'; // Padrão caso não haja avatar
        if (this.authService.loggedUser && this.authService.loggedUser.avatar) {
            avatarUrl = this.authService.loggedUser.avatar;
            localStorage.setItem('avatar', avatarUrl); // Armazena a URL da imagem no local storage
        }
        return avatarUrl;
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

        this.notifications = filteredLateMeals.map(
            (descricao) => `Refeição ${descricao.descricao} não cadastrada.`
        );

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

        this.todayRegisters.forEach((register) => (register.checked = true));
    }
}
