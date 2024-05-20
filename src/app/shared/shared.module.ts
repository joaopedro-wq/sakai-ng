import { CommonModule } from '@angular/common';
import { BarButtonsComponent } from './components/bar-buttons/bar-buttons.component';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { NgModule } from '@angular/core';
import { ToggleButtonModule } from 'primeng/togglebutton';

@NgModule({
    declarations: [BarButtonsComponent],
    imports: [
        CommonModule,

        ButtonModule,
        RippleModule,
        RouterModule,
        TooltipModule,
        MenuModule,
        ToggleButtonModule,

        ContextMenuModule,
    ],
    exports: [BarButtonsComponent],
})
export class SharedModule {}
