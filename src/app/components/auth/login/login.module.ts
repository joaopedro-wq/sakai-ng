import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { AppConfigModule } from 'src/app/layout/config/config.module';
import { PasswordModule } from 'primeng/password';
@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        ButtonModule,
        InputTextModule,
        CheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        AppConfigModule,
        RippleModule,
        InputGroupModule,
        PasswordModule,
        InputGroupAddonModule,
    ],
    declarations: [LoginComponent],
})
export class LoginModule {}
