import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { CheckListComponent } from './checkList.component';
import { ChecklistRoutingModule } from './checkList-routing.module';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { PopoverModule } from 'primeng/popover';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { ChartModule } from 'primeng/chart';
import { FieldsetModule } from 'primeng/fieldset';

@NgModule({
    declarations: [CheckListComponent],
    imports: [
        CommonModule,
        ChecklistRoutingModule,
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
        ListboxModule,
        PanelModule,
        ProgressBarModule,
        TooltipModule,
        BadgeModule,
        FieldsetModule,
        CheckboxModule,
        ChartModule,
    ],
})
export class CheckListModule {}
