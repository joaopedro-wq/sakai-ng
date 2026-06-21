import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormAlimentosComponent } from './form-alimentos.component';
import { FormAlimentosRoutingModule } from './form-alimentos-routing.module';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SharedModule } from "../../../shared/shared.module";
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';

@NgModule({
    declarations: [FormAlimentosComponent],
    imports: [
        CommonModule,
        FormAlimentosRoutingModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        BreadcrumbModule,
        DialogModule,
        InputMaskModule,
        DatePickerModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        InputNumberModule,
        CardModule,
        SharedModule
    ]
})
export class FormAlimentosModule {}
