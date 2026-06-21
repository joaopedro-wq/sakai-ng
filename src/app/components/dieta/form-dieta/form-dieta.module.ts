import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormDietaComponent } from './form-dieta.component';
import { FormDietaRoutingModule } from './form-dieta-routing.module';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
    declarations: [FormDietaComponent],
    imports: [
        CommonModule,
        FormDietaRoutingModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        DialogModule,
        InputMaskModule,
        DatePickerModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        InputNumberModule,
        CardModule,
        AutoCompleteModule,

        
    ]
})
export class FormDietaModule { }
