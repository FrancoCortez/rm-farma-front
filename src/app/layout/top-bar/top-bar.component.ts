import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutService } from '../../utils/services/layout.service';
import { NgClass } from '@angular/common';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './top-bar.component.html',
})
export class TopBarComponent {
  items!: MenuItem[];
  @ViewChild('menuButton') menuButton!: ElementRef;
  @ViewChild('topBarMenuButton') topBarMenuButton!: ElementRef;
  @ViewChild('topBarMenu') topBarMenu!: ElementRef;

  constructor(public layoutService: LayoutService) {}
}
