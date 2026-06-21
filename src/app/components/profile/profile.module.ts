import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { FileUploadModule } from 'primeng/fileupload';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { SharedModule } from '@/app/shared/shared.module';

@NgModule({
    declarations: [ProfileComponent],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        FileUploadModule,
        FormsModule,
        ReactiveFormsModule,
        DatePickerModule,
        InputTextModule,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        PasswordModule,
        SelectModule,
        AccordionModule,
        PanelModule,
        CardModule,
        FieldsetModule,
        SharedModule
    ],
})
export class ProfileModule {}
