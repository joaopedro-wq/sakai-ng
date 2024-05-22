import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import {  FormRegistroComponent } from './form-registro.component';
import { FormRegistroRoutingModule } from './form-registro-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SharedModule } from '../../../shared/shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
@NgModule({
    declarations: [FormRegistroComponent],
    imports: [
        CommonModule,
        FormRegistroRoutingModule,
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
        CardModule
    ],
})
export class FormRegistroModule {}
