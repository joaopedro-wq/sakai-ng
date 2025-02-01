import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { GalleriaModule } from 'primeng/galleria'; // Import GalleriaModule
import { ListRegistrosComponent } from './list-registros.component';
import { LisRegistroRoutingModule } from './list-registros-routing.module';

@NgModule({
    declarations: [ListRegistrosComponent],
    imports: [
        CommonModule,
        LisRegistroRoutingModule,
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
        GalleriaModule, // Add GalleriaModule here
    ],
})
export class ListRegistroModule {}
