import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormRefeicaoComponent } from './form-refeicao.component';
import { FormRefeicaoRoutingModule } from './form-refeicao-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SharedModule } from '../../../shared/shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';

@NgModule({
    declarations: [FormRefeicaoComponent],
    imports: [
        CommonModule,
        FormRefeicaoRoutingModule,
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
        CardModule,
        SharedModule,
    ],
})
export class FormRefeicaoModule {}
