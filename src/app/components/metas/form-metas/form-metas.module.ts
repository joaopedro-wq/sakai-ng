import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormMetasComponent } from './form-metas.component';
import { FormMetasRoutingModule } from './form-metas-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
@NgModule({
    declarations: [FormMetasComponent],
    imports: [
        CommonModule,
        FormMetasRoutingModule,
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
        InputSwitchModule,
    ],
})
export class FormMetasModule {}
