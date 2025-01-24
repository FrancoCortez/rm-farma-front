import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-modal-success',
  standalone: true,
  imports: [SweetAlert2Module],
  templateUrl: './modal-success.component.html',
})
export class ModalSuccessComponent {
  @Input() display!: boolean;
  @Input() message?: string;
  @Output() confirm: EventEmitter<boolean> = new EventEmitter();

  confirmation() {
    this.confirm.emit(false);
  }
}
