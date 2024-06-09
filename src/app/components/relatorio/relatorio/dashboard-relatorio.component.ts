import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { Alimento } from 'src/app/api/alimento';
import { Refeicao } from 'src/app/api/refeicao';
import { Registro } from 'src/app/api/registro';
import { FoodService } from 'src/app/service/alimento.service';
import { SnackService } from 'src/app/service/refeicao.service';
import { RegisterService } from 'src/app/service/registro.service';
import { ChartModule } from 'primeng/chart';
import { DatePipe } from '@angular/common';

@Component({
    templateUrl: './dashboard-relatorio.component.html',
    providers: [],
})
export class DashboardRelatorioComponent implements OnInit,  OnDestroy {
    private unsubscribe = new Subject<void>();
    listFoodies!: Alimento[];
    listSnackies!: Refeicao[];
    register: Registro[]= [];
    labelsGraficos:  any = []
    registroProteina: any[] = [];
    registroGordura: any[] = [];
    registroCarbo: any[] = [];
    nomeALimento: any[] = [];
    filtroForm!: FormGroup;
    registroCaloria: any[] = [];
    labelsDescricao_refeicao:  any = []
    showAlimentoChart: boolean = true;
    showRefeicaoChart: boolean = false;
    basicData: any;
    position: string = 'top';
    data: any;
    options: any;
    basicOptions: any;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        public foodService: FoodService,
        public registerService: RegisterService,
        private messageService: MessageService,
        private datePipe: DatePipe,

        public snackService: SnackService
    ) {
        
        this.registerService.obsListRegister
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
            this.register = res;
            this.filtrarRegistros();
            this.registerService.loadButtons('dashboard');
            
            });


        this.foodService.obsListFoods
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.listFoodies = res;
            });

        this.snackService.obsListSnacks
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
                this.listSnackies = res;
            });
    }

    filtrarRegistros() {
        const data = this.filtroForm.get('data')?.value;
        const dataFim = this.filtroForm.get('dataFim')?.value;


        if (data && dataFim ) {
            
            let saveFormFood = data;
            let dataFims = dataFim;
            saveFormFood = this.datePipe.transform(
                saveFormFood,
                'yyyy-MM-dd'
            )!;
            dataFims = this.datePipe.transform(
                dataFims,
                'yyyy-MM-dd'
            )!;
          
            const registrosFiltrados = this.register.filter((item) => {
                let dataItem = item.data;
                dataItem = this.datePipe.transform(
                    dataItem,
                    'yyyy-MM-dd'
                )!;
                return dataItem >= saveFormFood && dataItem <= dataFims;
               
            });
            
            this.labelsGraficos = registrosFiltrados.map((item: any) => this.formatDate(item.data));
            this.registroProteina = registrosFiltrados.map((item: any) => item.alimento.proteina);
            this.registroCarbo = registrosFiltrados.map((item: any) => item.alimento.carbo);
            this.registroGordura = registrosFiltrados.map((item: any) => item.alimento.gordura);
            this.nomeALimento = registrosFiltrados.map((item: any) => item.descricao_alimento);
            this.registroCaloria = registrosFiltrados.map((item: any) => item.alimento.caloria);
            this.labelsDescricao_refeicao = registrosFiltrados.map((item: any) => item.descricao_refeicao);
            this.setupChart();
            this.setupChartLine();
            
        } else {
            this.labelsGraficos = this.register.map((item: any) => this.formatDate(item.data));
            console.log('this.labelsGraficos',this.labelsGraficos)
            this.registroProteina = this.register.map((item: any) => item.nutrientes_totais.proteina);
            

            this.registroCarbo = this.register.map((item: any) => item.nutrientes_totais.carbo);
            this.registroGordura = this.register.map((item: any) => item.nutrientes_totais.gordura);
            
            this.nomeALimento = this.register.map((item: any) => {
                return item.alimentos.map((alimento: any) => alimento.descricao);
            });
            
           
            this.registroCaloria = this.register.map((item: any) =>item.nutrientes_totais.caloria);
            
            this.labelsDescricao_refeicao = this.register.map((item: any) => item.descricao_refeicao);
            this.setupChartLine();
            this.setupChart();
        }
        this.registerService.loadButtons('dashboard');

    }
    
    selectedOption: string = 'static';
    cancelarOptions(){
        this.registerService.modalOptions = false;
        this.registerService.loadButtons('dashboard');
    }

    confirmarOptions(){
       
        if (document.getElementById('mode1')['checked']) {
            this.showAlimentoChart = true;
            this.showRefeicaoChart = false;
        } else {
            this.showAlimentoChart = false;
            this.showRefeicaoChart = true;
        }
            this.registerService.modalOptions = false;
            this.registerService.loadButtons('dashboard');
            
        
    }
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
      


    ngOnInit() {
        this.registerService.loadButtons('dashboard');
        this.filtroForm = this.formBuilder.group({
            data: [null, Validators.required],
            dataFim: [null, Validators.required]

        });

        this.filtroForm.valueChanges.subscribe(() => {
            this.filtrarRegistros();
        });
    
    
    }
    setupChartLine(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        
        this.data = {
            labels: this.labelsDescricao_refeicao,
            datasets: [
                {
                    label: 'Proteina',
                    data: this.registroProteina,
                    fill: false,
                    tension: 0.4,
                    borderColor: documentStyle.getPropertyValue('--blue-500')
                },
                {
                    label: 'Carboidrato',
                    data: this.registroCarbo,
                    fill: false,
                 
                    tension: 0.4,
                    borderColor: documentStyle.getPropertyValue('--teal-500')
                },
                {
                    label: 'Gordura',
                    data: this.registroGordura,
                    fill: false,
                    borderDash: [5, 5],
                    tension: 0.4,
                    borderColor: documentStyle.getPropertyValue('--green-500')
                },
                {
                    label: 'Caloria',
                    data: this.registroCaloria,
                    fill: true,
                    borderColor: documentStyle.getPropertyValue('--orange-500'),
                    tension: 0.4,
                    backgroundColor: 'rgba(255,167,38,0.2)'
                }
            ]
        };
        
        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };


    }
    setupChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.basicData = {
            labels: this.labelsGraficos,
                    datasets: [
                        {
                            type: 'bar',
                            label: 'Proteina',
                            data: this.registroProteina,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            fill: false,
                            tension: 0.4,
                            borderWidth: 1
                        },
                        {
                            type: 'bar',
                            label: 'Carboidrato',
                            data: this.registroCarbo,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,

                        },
                        {
                            type: 'bar',
                            label: 'Gordura',
                            data: this.registroGordura,
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1,
                            
                        }
                    ]
                    
        };

        this.basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.5,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
   
}
