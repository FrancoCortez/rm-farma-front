import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  isProduction = environment.production;
  constructor(private router: Router) {}

  canActivate(): boolean {
    let isLoggedIn: boolean;
    if (this.isProduction) {
      isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    } else {
      isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }
    // const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      this.router.navigate(['/login']); // Redirigir al login si no está autenticado
      return false;
    }
    return true;
  }
}
