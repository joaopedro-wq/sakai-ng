import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { PopoverModule } from 'primeng/popover';
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
        SelectModule,
        DialogModule,
        DatePickerModule,
        CardModule,
        PopoverModule,
        GalleriaModule, // Add GalleriaModule here
    ],
})
export class ListRegistroModule {}
