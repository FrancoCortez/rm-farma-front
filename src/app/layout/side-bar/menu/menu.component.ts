import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../utils/services/layout.service';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { NgForOf, NgIf } from '@angular/common';
import { DataService } from '../../../utils/services/data.service';
import { ItemMenuModelDto } from '../../../utils/models/item-menu-model.dto';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuItemComponent, NgIf, NgForOf],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  model: ItemMenuModelDto[] = [];

  constructor(
    public layoutService: LayoutService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.dataService.getDataMenu().subscribe((data) => {
      this.model = data;
    });
  }
}
