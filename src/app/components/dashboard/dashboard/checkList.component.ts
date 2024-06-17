import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Refeicao } from 'src/app/api/refeicao';
import { Registro } from 'src/app/api/registro';
import { SnackService } from 'src/app/service/refeicao.service';
import { RegisterService } from 'src/app/service/registro.service';

@Component({
    templateUrl: './checkList.component.html',
})
export class CheckListComponent implements OnInit, OnDestroy {
    private unsubscribe = new Subject<void>();
    register: Registro[] = [];
    todayRegisters: Registro[] = [];
    snack: Refeicao[] = [];
    nextMealId: number | null = null;

    constructor(
        public registerService: RegisterService,
        public snackService: SnackService,
        private router: Router
    ) {
        this.registerService.obsListRegister
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.register = res;
                this.filterTodayRegisters();
                this.markRegisteredSnacks(); 
                this.calculateNextMeal(); 
            });

        this.snackService.obsListSnacks
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.snack = res;
                this.sortSnacksByTime();
                this.markRegisteredSnacks(); 
                this.calculateNextMeal(); 
            });
    }

    ngOnInit() {}

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
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

    sortSnacksByTime() {
        this.snack.sort((a, b) => {
            const [hoursA, minutesA, secondsA] = a.horario
                .split(':')
                .map(Number);
            const [hoursB, minutesB, secondsB] = b.horario
                .split(':')
                .map(Number);
            return (
                hoursA * 3600 +
                minutesA * 60 +
                (secondsA || 0) -
                (hoursB * 3600 + minutesB * 60 + (secondsB || 0))
            );
        });
        
    }

    calculateNextMeal() {
        const now = new Date();
        const nowTime =
            now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

        let closestMeal: Refeicao | null = null;
        let closestTimeDiff = Infinity;

      

        this.snack.forEach((snack) => {
            
            if (!snack.checked) {
                const [hours, minutes, seconds] = snack.horario
                    .split(':')
                    .map(Number);
                const snackTime = hours * 3600 + minutes * 60 + (seconds || 0);
                const timeDiff = snackTime - nowTime;

               
                if (timeDiff > 0 && timeDiff < closestTimeDiff) {
                    closestMeal = snack;
                    closestTimeDiff = timeDiff;
                }
            }
        });

        this.nextMealId = closestMeal ? closestMeal.id : null;
         
    }

    markRegisteredSnacks() {
        this.snack.forEach((snack) => {
            snack.checked = this.todayRegisters.some(
                (register) =>
                    register.descricao_refeicao.trim() ===
                    snack.descricao.trim()
            );
            
        });
    }

    navigateToNewRegister() {
        this.router.navigate(['/registros/registro']);
    }
}
