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
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { TabViewModule } from 'primeng/tabview';
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
        DropdownModule,
        DialogModule,
        CalendarModule,
        CardModule,
        OverlayPanelModule,
        ListboxModule,
        PanelModule,
        ProgressBarModule,
        TooltipModule,
        BadgeModule,
        FieldsetModule,
        
        CheckboxModule,
    ],
})
export class CheckListModule {}
