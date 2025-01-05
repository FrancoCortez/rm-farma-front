import { Component } from '@angular/core';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [BlockUIModule, ProgressSpinnerModule],
  styles: [
    `
      :host ::ng-deep .p-blockui {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
      }
    `,
  ],
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {
  blocked: boolean = true;
}
