import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormDietaComponent } from './form-dieta.component';
import { FormDietaRoutingModule } from './form-dieta-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';

@NgModule({
    declarations: [FormDietaComponent],
    imports: [
        CommonModule,
        FormDietaRoutingModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        DialogModule,
        InputMaskModule,
        CalendarModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        InputNumberModule,
        CardModule,
        
    ]
})
export class FormDietaModule { }
