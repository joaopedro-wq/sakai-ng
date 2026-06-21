import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { ListDietaComponent } from './list-dieta.component';
import { ListDietaRoutingModule } from './list-dieta-routing.module';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';

@NgModule({
    declarations: [ListDietaComponent],
    imports: [
        CommonModule,
        ListDietaRoutingModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        SelectModule,
        DialogModule,
        DatePickerModule,
        CardModule
    ]
})
export class ListDietaModule { }
