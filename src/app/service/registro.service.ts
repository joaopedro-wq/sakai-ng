import { EventEmitter, Injectable } from '@angular/core';
import { Alimento } from '../api/alimento';
import { DatePipe } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { BarButtonsService } from '../shared/service/bar-buttons.service';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Button } from 'src/app/shared/api/button';
import { BarButton } from '../shared/api/bar-button';
import { ActionButton } from '../shared/api/action-button';
import { HttpPersonService } from './http-person.service';
import { Registro } from '../api/registro';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Injectable({
    providedIn: 'root',
})
export class RegisterService {
    private buttonsForm: Array<Button> = [
        {
            title: 'voltar',
            label: 'Voltar',
            id: 'Alimento_voltar',
            visible: true,
            disabled: false,
            class: 'p-button-outlined p-button-plain mr-2',
            icon: 'pi pi-chevron-left',
            routerLink: ['/registros'],
            tooltip: '',
        },
        {
            title: 'excluir',
            label: 'Excluir',
            id: 'Alimento_excluir',
            visible: false,
            disabled: false,
            class: 'p-button-danger',
            icon: 'pi pi-trash',
            routerLink: [],
            tooltip: '',
        },
        {
            title: 'salvar',
            label: 'Salvar',
            id: 'Alimento_salvar',
            visible: true,
            disabled: true,
            class: 'p-button-success mr-2',
            icon: 'pi pi-save',
            routerLink: [],
            tooltip: '',
        },
        {
            title: 'filtro',
            label: 'Dieta',
            id: 'Alimento_Opcao',
            visible: true,
            disabled: false,
            class: 'p-button-outlined mr-2',
            icon: 'pi pi-eye',
            routerLink: [],
            tooltip: '',
        },
    ];

    private buttonsList: Array<Button> = [
        {
            title: 'cadastrar',
            label: 'Cadastrar',
            id: 'Alimento_cadastrar',
            visible: true,
            disabled: false,
            class: 'inline-block',
            icon: 'pi pi-plus',
            routerLink: ['/registros/registro'],
            tooltip: '',
        },
    ];
    private buttonsDashboard: Array<Button> = [
        {
            title: 'Opcao',
            label: 'Filtro',
            id: 'Alimento_Opcao',
            visible: true,
            disabled: false,
            class: 'p-button-outlined',
            icon: 'pi pi-filter',
            routerLink: [],
            tooltip: '',
        },
        {
            title: 'excel',
            label: 'Excel',
            id: 'Alimento_Opcao',
            visible: true,
            disabled: false,
            class: 'button-custom button-excel',
            icon: 'pi pi-file-excel',
            routerLink: [],
            tooltip: 'Exportação via Excel',
        },
        {
            title: 'pdf',
            label: 'PDF',
            id: 'Alimento_Opcao',
            visible: true,
            disabled: false,
            class: 'p-button-danger',
            icon: 'pi pi-file-pdf',
            routerLink: [],
            tooltip: 'Exportação via PDF',
        },
    ];

    private barButton: BarButton = {
        keyService: 'RegisterService',
        buttons: [],
    };

    buttonState(action: string, nmButton: string, value: boolean) {
        switch (action) {
            case 'disabled':
                this.barButton.buttons.filter((button) => {
                    if (button.title == nmButton) {
                        button.disabled = value;
                    }
                });
                break;
            case 'visible':
                this.barButton.buttons.filter((button) => {
                    if (button.title == nmButton) {
                        button.visible = value;
                    }
                });
                break;
        }
    }
    modalOptions: boolean = false;
    modalFIlter: boolean = false;
    public registersList!: Registro[];
    private formRegister!: Registro;
    obsListRegister: EventEmitter<Registro[]> = new EventEmitter();
    obsLoadRegister: EventEmitter<Registro> = new EventEmitter();
    obsSaveRegister: EventEmitter<any> = new EventEmitter();
    obsDeleteRegister: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpPersonService,
        private barButtonsService: BarButtonsService,
        private datePipe: DatePipe,

        private confirmationService: ConfirmationService
    ) {
        this.barButtonsService.execActionButton.subscribe(
            (res: ActionButton) => {
                if (res.keyService == 'RegisterService') {
                    this.execActionButton(res.actionButton);
                }
            }
        );
    }

    execActionButton(action: string) {
        switch (action) {
            case 'salvar':
                let saveFormFood: Registro = this.formRegister;
                saveFormFood.data = this.datePipe.transform(
                    saveFormFood.data,
                    'yyyy-MM-dd'
                )!;

                if (saveFormFood.id) {
                    this.updateRegister(saveFormFood).subscribe();
                } else {
                    this.createRegister(saveFormFood).subscribe();
                }

                break;
            case 'excluir':
                this.confirmDeleteRegister();
                break;
            case 'Opcao':
                this.modalOptions = true;
                break;
            case 'filtro':
                this.modalFIlter = true;

                break;
            case 'excel':
                this.modalExportExcel = true;

                break;
            case 'pdf':
                this.modalExportPdf = true;
                break;
        }
    }

    modalExportExcel: boolean = false;
    modalExportPdf: boolean = false;

    generateExcel() {
        const formattedData = this.formatData(this.registersList);
        this.exportToExcel(formattedData);
    }

    generateExcelByDate(startDate: Date | null, endDate: Date | null) {
        if (!startDate || !endDate) {
          this.confirmationService.confirm({
              message: 'Por favor, selecione as datas de início e término.',
              header: 'Erro de Exportação',
              icon: 'pi pi-exclamation-triangle',
              acceptLabel: 'OK',
              rejectVisible: false, 
          });
            return;
        }

        const filteredData = this.registersList.filter((item) => {
            const itemDate = new Date(item.data);
            return itemDate >= startDate && itemDate <= endDate;
        });

        const formattedData = this.formatData(filteredData);
        this.exportToExcel(formattedData);
    }

    formatData(data: any[]) {
        return data.map((item) => ({
            Data: this.formatDate(item.data),
            'Descrição da Refeição': item.descricao_refeicao,
            Alimentos: item.alimentos
                .map((alimento) => alimento.descricao)
                .join(', '),
            'Proteínas (g)': item.nutrientes_totais.proteina,
            'Gorduras (g)': item.nutrientes_totais.gordura,
            'Carboidratos (g)': item.nutrientes_totais.carbo,
            'Calorias (kcal)': item.nutrientes_totais.caloria,
        }));
    }

    calculateTotal(data: any[], columnName: string): number {
        return data.reduce(
            (acc, curr) => acc + parseFloat(curr[columnName] || 0),
            0
        );
    }
    exportToExcel(data: any[]) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

        
        ws['!cols'] = [
            { wpx: 100 },
            { wpx: 150 },
            { wpx: 350 },
            { wpx: 75 },
            { wpx: 75 },
            { wpx: 80 },
            { wpx: 75 },
        ];

        
        const headerCellStyle = {
            font: { bold: true },
            fill: { fgColor: { rgb: 'FFFFAA00' } },
            alignment: { horizontal: 'center' },
        };

        // Aplicando estilos ao cabeçalho
        const range = XLSX.utils.decode_range(ws['!ref']!);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const headerCellAddress = XLSX.utils.encode_col(C) + '1';
            if (!ws[headerCellAddress]) continue;
            Object.assign(ws[headerCellAddress], headerCellStyle);
        }

        // Adicionando linha de totais
        const totalRow = [
            '',
            '',
            'Totais',
            this.calculateTotal(data, 'Proteínas (g)'),
            this.calculateTotal(data, 'Gorduras (g)'),
            this.calculateTotal(data, 'Carboidratos (g)'),
            this.calculateTotal(data, 'Calorias (kcal)'),
        ];

        XLSX.utils.sheet_add_aoa(ws, [totalRow], { origin: -1 });

        // Estilizando os dados da planilha
        const dataCellStyle = {
            border: {
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } },
            },
            alignment: { horizontal: 'center' },
        };

        // Aplicando estilos aos dados
        for (let R = range.s.r + 1; R <= range.e.r + 1; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) continue;
                Object.assign(ws[cellAddress], dataCellStyle);
            }
        }

        // Criando e salvando o arquivo Excel
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Registros');
        XLSX.writeFile(wb, 'Registros.xlsx');
    }
    generatePDF() {
        const formattedData = this.formatData(this.registersList);
        this.exportToPDF(formattedData);
    }

    generatePDFByDate(startDate: Date | null, endDate: Date | null) {
        if (!startDate || !endDate) {
           this.confirmationService.confirm({
               message: 'Por favor, selecione as datas de início e término.',
               header: 'Erro de Exportação',
               icon: 'pi pi-exclamation-triangle',
               acceptLabel: 'OK',
               rejectVisible: false,
           });
            return;
        }

        const filteredData = this.registersList.filter((item) => {
            const itemDate = new Date(item.data);
            return itemDate >= startDate && itemDate <= endDate;
        });

        const formattedData = this.formatData(filteredData);
        this.exportToPDF(formattedData);
    }
    exportToPDF(data: any[]) {
        const doc = new jsPDF();

        // Adicionando uma imagem e título na mesma linha
        const imageUrl = '../../assets/layout/images/OficialLogo1.png'; // Adicione aqui a sua imagem
        const imgWidth = 70;
        const imgHeight = 70;
        const margin = 10;

        // Posição da imagem
        const imgX = doc.internal.pageSize.getWidth() - imgWidth - margin;
        const imgY = 10;

        // Posição do título
        const titleX = margin;
        const titleY = imgY + imgHeight / 2;

        doc.addImage(imageUrl, 'PNG', imgX, imgY, imgWidth, imgHeight);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Relatório de Registros de Refeições', titleX, titleY);

        // Estilos para a tabela
        const tableColumn = [
            'Data',
            'Descrição da Refeição',
            'Alimentos',
            'Proteína (g)',
            'Gordura (g)',
            'Carboidrato (g)',
            'Calorias (kcal)',
        ];

        const tableRows: any[] = [];

        // Inicializando os totais
        let totalProteina = 0;
        let totalGordura = 0;
        let totalCarboidrato = 0;
        let totalCalorias = 0;

        data.forEach((item) => {
            const row = [
                item.Data,
                item['Descrição da Refeição'],
                item.Alimentos,
                item['Proteínas (g)'],
                item['Gorduras (g)'],
                item['Carboidratos (g)'],
                item['Calorias (kcal)'],
            ];
            tableRows.push(row);

            // Somando os totais
            totalProteina += parseFloat(item['Proteínas (g)']);
            totalGordura += parseFloat(item['Gorduras (g)']);
            totalCarboidrato += parseFloat(item['Carboidratos (g)']);
            totalCalorias += parseFloat(item['Calorias (kcal)']);
        });

        // Adicionando a linha de totais
        const totalRow = [
            '', // Data
            '', // Descrição da Refeição
            'Totais', // Alimentos
            totalProteina.toFixed(2),
            totalGordura.toFixed(2),
            totalCarboidrato.toFixed(2),
            totalCalorias.toFixed(2),
        ];

        tableRows.push(totalRow);

        // AutoTable plugin para gerar a tabela
        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: imgY + imgHeight + 10,
            styles: { fontSize: 8, halign: 'center' },
            headStyles: {
                fillColor: [0, 128, 0],
                textColor: 255,
                fontSize: 10,
                halign: 'center',
            },
            bodyStyles: { lineColor: [0, 0, 0], lineWidth: 0.1 },
            footStyles: {
                fillColor: [0, 128, 0],
                textColor: 255,
                fontSize: 10,
                halign: 'center',
            },
        });

        doc.save('RelatorioRegistros.pdf');
    }

    formatDate(dateInput: string | Date): string {
        const date = new Date(dateInput);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    loadButtons(nmListButtons: string) {
        if (nmListButtons == 'form') {
            this.barButton.buttons = this.buttonsForm;
        } else if (nmListButtons == 'list') {
            this.barButton.buttons = this.buttonsList;
        } else if (nmListButtons == 'dashboard') {
            this.barButton.buttons = this.buttonsDashboard;
        }

        this.barButtonsService.startBarraButtons(this.barButton);
    }

    loadRegisters(): Observable<any> {
        return this.http.get('/api/registro').pipe(
            tap((res: any) => {
                if (res.success) {
                    this.registersList = res.data;
                    this.obsListRegister.emit(this.registersList);
                }
            }),
            catchError((error: any) => {
                console.error('Error :', error);
                return throwError(() => new Error(error.message || error));
            })
        );
    }

    loadRegister(id: number): Observable<any> {
        return this.http.get(`/api/registro/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                if (res.success) {
                    this.obsLoadRegister.emit(res.data);
                }
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    createRegister(formRegister: Registro): Observable<any> {
        return this.http.post('/api/registro', formRegister).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsSaveRegister.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    updateRegister(formRegister: Registro): Observable<any> {
        return this.http
            .put(`/api/registro/${formRegister.id}`, formRegister)
            .pipe(
                tap((res: any) => {
                    // Executa uma ação quando a requisição for bem-sucedida
                    this.obsSaveRegister.emit(res);
                }),
                catchError((error: any) => {
                    // Trata o erro da requisição e propaga o erro através de um Observable de erro
                    return throwError(() => new Error(error));
                })
            );
    }

    deleteRegister(id: number): Observable<any> {
        return this.http.delete(`/api/registro/${id}`).pipe(
            tap((res: any) => {
                // Executa uma ação quando a requisição for bem-sucedida
                this.obsDeleteRegister.emit(res);
            }),
            catchError((error: any) => {
                // Trata o erro da requisição e propaga o erro através de um Observable de erro
                return throwError(() => new Error(error));
            })
        );
    }

    public setformFood(formRegister: Registro) {
        this.formRegister = formRegister;
    }

    confirmDeleteRegister() {
        this.confirmationService.confirm({
            target: new EventTarget(),
            message: 'Realmente deseja excluir este Registro?',
            header: 'Confirmação de exclusão',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-outlined',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Excluir',
            rejectLabel: 'Cancelar',

            accept: () => {
                let registerId: number | undefined = this.formRegister.id;
                if (registerId) this.deleteRegister(registerId).subscribe();
            },
            reject: () => {},
        });
    }
}
