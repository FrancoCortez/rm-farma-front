import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-modal-error',
  standalone: true,
  imports: [DialogModule, SweetAlert2Module],
  templateUrl: './modal-error.component.html',
})
export class ModalErrorComponent {
  @Input() display!: boolean;
  @Input() message?: string;
}
