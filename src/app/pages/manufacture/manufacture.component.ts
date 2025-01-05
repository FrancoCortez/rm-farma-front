import { Component } from '@angular/core';
import { AddManufactureComponent } from './add-manufacture/add-manufacture.component';

@Component({
  selector: 'app-manufacture',
  standalone: true,
  imports: [AddManufactureComponent],
  templateUrl: './manufacture.component.html',
})
export class ManufactureComponent {}
