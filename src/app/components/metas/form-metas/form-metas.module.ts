import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormMetasComponent } from './form-metas.component';
import { FormMetasRoutingModule } from './form-metas-routing.module';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DialogService } from 'primeng/dynamicdialog';
@NgModule({
    declarations: [FormMetasComponent],
    imports: [
        CommonModule,
        FormMetasRoutingModule,
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
        AutoCompleteModule,
        CardModule,
        MultiSelectModule,
        ToggleSwitchModule,
       
    ],
})
export class FormMetasModule {}
