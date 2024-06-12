import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { FileUploadModule } from 'primeng/fileupload';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    declarations: [ProfileComponent],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        FileUploadModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        InputTextModule,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        PasswordModule,
        DropdownModule,

    ],
})
export class ProfileModule {}
