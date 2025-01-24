import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface MenuChangeEvent {
  key: string;
  routeEvent?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  private menuSource = new Subject<MenuChangeEvent>();
  menuSource$ = this.menuSource.asObservable();
  private resetSource = new Subject();
  resetSource$ = this.resetSource.asObservable();

  constructor() {}

  onMenuStateChange(event: MenuChangeEvent) {
    this.menuSource.next(event);
  }

  reset() {
    this.resetSource.next(true);
  }
}
