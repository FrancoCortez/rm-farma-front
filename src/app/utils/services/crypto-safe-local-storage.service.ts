import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptoSafeLocalStorageService {
  private secretKey = 'your-secret-key';

  constructor() {}

  encrypt(value: Object): string {
    const valueJson = JSON.stringify(value);
    return CryptoJS.AES.encrypt(valueJson, this.secretKey).toString();
  }

  decrypt(data: string): any {
    const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  saveCryptoLocalStorage(key: string, value: Object) {
    const crypto = this.encrypt(value);
    localStorage.setItem(key, crypto);
  }

  loadCryptoLocalStorage(key: string): any {
    const crypto = localStorage.getItem(key);
    if (crypto) {
      return this.decrypt(crypto);
    }
  }

  cleanLocalStorage(key: string) {
    localStorage.removeItem(key);
  }
}
