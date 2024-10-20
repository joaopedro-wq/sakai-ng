import { EventEmitter, Injectable } from '@angular/core';
import { ActionButton } from '../components/api/action-button';
import { BarButton } from '../components/api/bar-button';

@Injectable({
    providedIn: 'root',
})
export class BarButtonsService {
    loadButtons = new EventEmitter();
    execActionButton = new EventEmitter();

    startBarraButtons(barraButton: BarButton) {
        this.loadButtons.emit(barraButton);
    }

    startActionButton(actionButton: ActionButton) {
        this.execActionButton.emit(actionButton);
    }
}
