import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { manufactureReportRoutes } from './pages/manufacture-report/manufacture-report.routes';
import { LoginComponent } from './pages/login/login.component';
import {AuthGuardService} from "./services/auth-guard.service";

export const routes: Routes = [
  {
    path: 'main',
    component: MainLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'patient',
        loadChildren: () =>
          import('./pages/patient/patient.routes').then((m) => m.patientRoutes),
      },
      {
        path: 'check-patient',
        loadChildren: () =>
          import('./pages/check-patient/check-patient.routes').then(
            (m) => m.checkPatientRoutes,
          ),
      },
      {
        path: 'production',
        loadChildren: () =>
          import('./pages/manufacture/manufacture.routes').then(
            (m) => m.manufactureRoutes,
          ),
      },
      {
        path: 'production-report',
        loadChildren: () =>
          import('./pages/manufacture-report/manufacture-report.routes').then(
            (m) => m.manufactureReportRoutes,
          ),
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
