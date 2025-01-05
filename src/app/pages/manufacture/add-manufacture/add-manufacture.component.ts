import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { Button, ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-add-manufacture',
  standalone: true,
  imports: [InputTextModule, ButtonDirective, Ripple, Button, AccordionModule],
  templateUrl: './add-manufacture.component.html',
})
export class AddManufactureComponent {}
