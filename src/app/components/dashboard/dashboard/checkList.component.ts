import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Registro } from 'src/app/api/registro';
import { RegisterService } from 'src/app/service/registro.service';

@Component({
    templateUrl: './checkList.component.html',
})
export class CheckListComponent implements OnInit, OnDestroy {
    private unsubscribe = new Subject<void>();
    register: Registro[] = [];
    todayRegister: Registro | null = null; 

    constructor(
        public registerService: RegisterService,
        private router: Router
    ) {
        this.registerService.obsListRegister
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.register = res;
                this.filterTodayRegisters();
            });
    }

    ngOnInit() {
        
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
    todayRegisters: Registro[] = [];
    filterTodayRegisters() {
        const today = new Date();
        const todayFormatted = today.toLocaleDateString();
        
        this.todayRegisters = this.register.filter(r => {
            const registerDate = new Date(r.data);
            const registerFormatted = registerDate.toLocaleDateString();
            return todayFormatted === registerFormatted;
        });

        // Optionally, you can mark all today's registers as checked
        this.todayRegisters.forEach(register => register.checked = true);
    }

    navigateToNewRegister() {
        this.router.navigate(['/registros/registro']);
    }
}
