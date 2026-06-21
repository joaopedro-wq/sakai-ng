import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { ListRefeicaoComponent } from './list-refeicao.component';
import { ListRefeicaoRoutingModule } from './list-refeicao-routing.module';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';

@NgModule({
    declarations: [ListRefeicaoComponent],
    imports: [
        CommonModule,
        ListRefeicaoRoutingModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        SelectModule,
        DialogModule,
        DatePickerModule,
    ],
})
export class ListRefeicaoModule {}
