import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { ListAlimentosComponent } from './list-alimentos.component';
import { ListAlimentosRoutingModule } from './list-alimentos-routing.module';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';


@NgModule({
    declarations: [ListAlimentosComponent],
    imports: [
        CommonModule,
        ListAlimentosRoutingModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        SelectModule,
        DialogModule,
        DatePickerModule,
    ]
})
export class ListAlimentosModule { }
