import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DashboardRelatorioComponent } from './dashboard-relatorio.component';
import { DashboardRelatoriooRoutingModule } from './dashboard-relatorio-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChartModule } from 'primeng/chart';
@NgModule({
    declarations: [DashboardRelatorioComponent],
    imports: [
        CommonModule,
        DashboardRelatoriooRoutingModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        BreadcrumbModule,
        DialogModule,
        InputMaskModule,
        CalendarModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        InputNumberModule,
        AutoCompleteModule,
        CardModule,
        MultiSelectModule,
        ChartModule,
        RadioButtonModule
    ],
})
export class DashboardRelatorioModule {}
