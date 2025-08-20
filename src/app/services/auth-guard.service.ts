import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    // if (!isLoggedIn) {
    //   this.router.navigate(['/login']); // Redirigir al login si no está autenticado
    //   return false;
    // }
    return true;
  }
}
