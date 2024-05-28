import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RedefinePasswordRoutingModule } from './redefine-password-routing.module';
import { RedefinePasswordComponent } from './redefine-password.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { AppConfigModule } from 'src/app/layout/config/config.module';


@NgModule({
  declarations: [RedefinePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    CheckboxModule,
    AppConfigModule,
    RippleModule,
    PasswordModule,
    InputGroupModule,
    InputGroupAddonModule,
    RedefinePasswordRoutingModule
  ]
})
export class RedefinePasswordModule { }
