import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'main',
    component: MainLayoutComponent,
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
    ],
  },

  { path: '**', redirectTo: 'main', pathMatch: 'full' },
];
