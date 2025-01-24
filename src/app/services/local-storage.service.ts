import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  saveLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  readLocalStorage<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  }

  cleanLocalStorage(key: string) {
    localStorage.removeItem(key);
  }
}
