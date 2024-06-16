import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { CheckListComponent } from './checkList.component';
import { ChecklistRoutingModule } from './checkList-routing.module';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';

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
        DropdownModule,
        DialogModule,
        CalendarModule,
        CardModule,
        OverlayPanelModule,
        ListboxModule,
        CheckboxModule
    ],
})
export class CheckListModule {}
