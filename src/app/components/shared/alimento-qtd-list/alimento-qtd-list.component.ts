import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { Alimento } from '../../../api/alimento';

export interface QtdChangeEvent {
    id: number;
    qtd: number;
}

@Component({
    selector: 'app-alimento-qtd-list',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, InputNumberModule],
    templateUrl: './alimento-qtd-list.component.html',
    styleUrl: './alimento-qtd-list.component.scss',
})
export class AlimentoQtdListComponent {
    @Input() alimentos: Alimento[] = [];
    @Input() qtdFn: (id: number) => number = () => 100;
    @Output() qtdChange = new EventEmitter<QtdChangeEvent>();

    onQtdChange(id: number, value: number) {
        this.qtdChange.emit({ id, qtd: value ?? 1 });
    }
}
