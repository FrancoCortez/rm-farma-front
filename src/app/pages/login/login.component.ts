import { Component } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass, NgIf } from '@angular/common';
import { SpinnerComponent } from '../../utils/components/spinner/spinner.component';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    PasswordModule,
    CheckboxModule,
    FormsModule,
    Ripple,
    ButtonDirective,
    InputTextModule,
    NgClass,
    NgIf,
    SpinnerComponent,
  ],
  styles: [
    `
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  password!: string;
  username!: string;
  errorMessage: string = '';
  flagError: boolean = false;
  isLoading = false;

  constructor(private router: Router) {}

  // Victoria Penichet // Lorenzo Cifuentes // Guillermo Erpel // Paloma Hernandez // Pamela Figari
  permissionsUsers = [
    { username: 'fcortez', password: 'fcortez' },
    { username: 'vpenichet', password: 'IP.2009' },
    { username: 'lcifuentes', password: 'fuenteslci' },
    { username: 'gerpel', password: 'pelger' },
    { username: 'phernandez', password: 'ph01' },
    { username: 'pfigari', password: '1234' },
    { username: 'avillarroel', password: 'Andy3614' },
    { username: 'pcalderon', password: 'pc*01' },
  ];

  loginEvent() {
    this.isLoading = true;
    const isProduction = environment.production;
    setTimeout(() => {
      const userLogin = this.permissionsUsers.find(
        (user) =>
          user.username === this.username && user.password === this.password,
      );
      if (!userLogin) {
        this.errorMessage = 'El usuario o contraseña son incorrectos';
        this.flagError = true;
        sessionStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('x-auditor');
      } else {
        if (isProduction) {
          sessionStorage.setItem('isLoggedIn', 'true');
        } else {
          localStorage.setItem('isLoggedIn', 'true');
        }
        this.flagError = false;
        localStorage.setItem('x-auditor', this.username);
        this.router.navigate(['/main']);
      }
      this.isLoading = false;
    }, 2000);
  }
}
