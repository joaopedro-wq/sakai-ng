import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { ListMetasComponent } from './list-metas.component';
import { ListMetasRoutingModule } from './list-metas-routing.module';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
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
        DropdownModule,
        DialogModule,
        CalendarModule,
        CardModule,
        OverlayPanelModule,
        ProgressBarModule,
        ToastModule
    ],
})
export class ListMetasModule {}
