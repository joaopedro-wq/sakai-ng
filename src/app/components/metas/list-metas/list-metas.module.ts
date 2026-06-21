import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { ListMetasComponent } from './list-metas.component';
import { ListMetasRoutingModule } from './list-metas-routing.module';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { PopoverModule } from 'primeng/popover';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
@NgModule({
    declarations: [ListMetasComponent],
    imports: [
        CommonModule,
        ListMetasRoutingModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        SelectModule,
        DialogModule,
        DatePickerModule,
        CardModule,
        PopoverModule,
        ProgressBarModule,
        ToastModule
    ],
})
export class ListMetasModule {}
