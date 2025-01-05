import { Component } from '@angular/core';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './side-bar.component.html',
})
export class SideBarComponent {}
