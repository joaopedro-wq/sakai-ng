import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Metas } from 'src/app/api/metas';
import { Refeicao } from 'src/app/api/refeicao';
import { Registro } from 'src/app/api/registro';
import { User } from 'src/app/api/user';
import { AuthService } from 'src/app/service/auth.service';
import { GoalService } from 'src/app/service/metas.service';
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
    today: string;
    currentTime: string;
    location: string;
    dayOfWeek: string;
    goal: Metas[] = [];
    loggedUser!: User;
    data: any;
    options: any;
    selectedDate = new Date();
    constructor(
        public registerService: RegisterService,
        public snackService: SnackService,
        public goalService: GoalService,
        public authService: AuthService,

        private router: Router
    ) {
        this.registerService.obsListRegister
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.register = res;
                this.filterTodayRegisters(this.selectedDate);
                
               this.markRegisteredSnacks(this.todayRegisters);

                this.calculateNextMeal();
                this.calculateTotalCalories();
                this.calculateproteina();
                this.calculatecarbos();
                this.calculategordura();
                this.data = this.getDataForChart(this.todayRegisters);
            });

        this.snackService.obsListSnacks
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.snack = res;
                this.filterTodayRegisters(this.selectedDate);

                this.sortSnacksByTime();
                this.markRegisteredSnacks(this.todayRegisters);

                this.calculateNextMeal();
            });

        this.goalService.obsListGoal
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.goal = res;
            });
        this.authService.obsGetLoggedUser
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.loggedUser = res;
            });
    }

    ngOnInit() {
      
     
        this.data = this.getDataForChart(this.todayRegisters);
    }

    getDataForChart(todayRegisters) {
        const totalNutrients = {
            proteina: 0,
            gordura: 0,
            carbo: 0,
            caloria: 0,
        };

        todayRegisters.forEach((registro) => {
            totalNutrients.proteina += registro.nutrientes_totais.proteina;
            totalNutrients.gordura += registro.nutrientes_totais.gordura;
            totalNutrients.carbo += registro.nutrientes_totais.carbo;
            totalNutrients.caloria += registro.nutrientes_totais.caloria;
        });

        const data = {
            labels: ['Calorias', 'Proteínas', 'Carboidratos', 'Gorduras'],
            datasets: [
                {
                    label: 'Consumo',
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1,
                    hoverBorderColor: '#000000',
                    data: [
                        totalNutrients.caloria.toFixed(2),
                        totalNutrients.proteina.toFixed(2),
                        totalNutrients.carbo.toFixed(2),
                        totalNutrients.gordura.toFixed(2),
                    ],
                    fill: true,
                },
            ],
        };

        this.data = data;
        this.options = {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 70,
            legend: {
                position: 'bottom',
            },
            elements: {
                arc: {
                    borderWidth: 0,
                },
            },
        };

        return data;
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    updateTime() {
        const now = new Date();
        this.currentTime = now.toLocaleTimeString();
    }

    totalProteins: number = 0;

    calculateProgress(goalValue: number, actualValue: number): number {
        return actualValue > 0
            ? Math.min((actualValue / goalValue) * 100, 100)
            : 0;
    }

  
    
    filtroHoje() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        this.selectedDate = yesterday;
       
        
    }
    
    
   filterTodayRegisters(selectedDate: Date) {
    const formattedSelectedDate = `${selectedDate.getFullYear()}-${('0' + (selectedDate.getMonth() + 1)).slice(-2)}-${('0' + selectedDate.getDate()).slice(-2)}`;
    
    // Filtrar registros com base na data selecionada
    this.todayRegisters = this.register.filter((r) => {
        return formattedSelectedDate === r.data;
    });

    // Marcar registros como selecionados
    this.todayRegisters.forEach((register) => (register.checked = true));
    

    // Chamar a função para marcar lanches registrados
    this.markRegisteredSnacks(this.todayRegisters);
    this.calculateNextMeal()
    this.sortSnacksByTime() 
                this.data = this.getDataForChart(this.todayRegisters);
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
            const [hours, minutes, seconds] = snack.horario
                .split(':')
                .map(Number);
            const snackTime = hours * 3600 + minutes * 60 + (seconds || 0);
            const timeDiff = snackTime - nowTime;

            if (snack.checked) {
                snack.notRegistered = false;
                return;
            }

            if (timeDiff > 0 && timeDiff < closestTimeDiff) {
                closestMeal = snack;
                closestTimeDiff = timeDiff;
            } else if (timeDiff < 0 && !snack.checked) {
                snack.notRegistered = true;
            }
        });

        this.nextMealId = closestMeal ? closestMeal.id : null;
    }
    getMealName(nextMealId: number): string {
        const meal = this.snack.find((snack) => snack.id === nextMealId);
        return meal ? meal.descricao : '';
    }

    getMealTime(nextMealId: number): string {
        const meal = this.snack.find((snack) => snack.id === nextMealId);
        return meal ? this.formatarHorario(meal.horario) : '';
    }

    formatarHorario(horario: string): string {
        return horario.slice(0, 5);
    }
   markRegisteredSnacks(todayRegisters: any[]) {
    

    this.snack.forEach((snack) => {
        snack.checked = todayRegisters.some((register) =>
            register.descricao_refeicao.trim() === snack.descricao.trim()
        );
    });
}


    navigateToNewRegister() {
        this.router.navigate(['/registros/registro']);
    }
    navigateToProfile() {
        this.router.navigate(['/profile']);
    }
    navigateToNewGoal() {
        this.router.navigate(['/metas/registro']);
    }
    totalCalories: number = 0;
    totalGordu: number = 0;
    totalprot: number = 0;
    totalCarbo: number = 0;

    calculateTotalCalories() {
        const total = this.todayRegisters.reduce((sum, register) => {
            return sum + register.nutrientes_totais.caloria;
        }, 0);
        this.totalCalories = parseFloat(total.toFixed(2));
    }
    calculateproteina() {
        const total = this.todayRegisters.reduce((sum, register) => {
            return sum + register.nutrientes_totais.proteina;
        }, 0);
        this.totalprot = parseFloat(total.toFixed(2));
    }
    calculatecarbos() {
        const total = this.todayRegisters.reduce((sum, register) => {
            return sum + register.nutrientes_totais.carbo;
        }, 0);
        this.totalCarbo = parseFloat(total.toFixed(2));
    }
    calculategordura() {
        const total = this.todayRegisters.reduce((sum, register) => {
            return sum + register.nutrientes_totais.gordura;
        }, 0);
        this.totalGordu = parseFloat(total.toFixed(2));
    }
    calculateTotalNutrient(nutrient: string): number {
        const total = this.todayRegisters.reduce((sum, register) => {
            return sum + register.nutrientes_totais[nutrient];
        }, 0);
        return parseFloat(total.toFixed(2));
    }

    getGoalProgress(goalValue: number, totalValue: number): number {
        const progress = (totalValue * 100) / goalValue;

        return parseFloat(progress.toFixed(2));
    }
    getLateMeals(): any[] {
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const lateMeals = this.snack.filter(
            (snack) =>
                !snack.checked &&
                parseInt(snack.horario.split(':')[0]) < currentHours
        );

        return lateMeals;
    }

    showNotification = false;

    toggleNotification() {
        this.showNotification = !this.showNotification;
    }
}
