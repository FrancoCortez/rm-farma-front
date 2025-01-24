import { Routes } from '@angular/router';
import { CheckPatientComponent } from './check-patient.component';
import { CheckPatientDetailComponent } from './check-patient-detail/check-patient-detail.component';
export const checkPatientRoutes: Routes = [
  {
    path: '',
    component: CheckPatientComponent,
    children: [
      { path: 'check-patient', component: CheckPatientDetailComponent },
      // { path: 'list-patient', component: ListPatientComponent },
      // { path: '**', redirectTo: 'list-patient', pathMatch: 'full' },
    ],
  },
];
