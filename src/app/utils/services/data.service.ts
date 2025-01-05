import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemMenuModelDto } from '../models/item-menu-model.dto';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getDataMenu(): Observable<ItemMenuModelDto[]> {
    return this.http.get<ItemMenuModelDto[]>(
      'assets/demo/data/menu-items.json',
    );
  }
}
