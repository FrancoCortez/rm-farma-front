import { Routes } from '@angular/router';
import { PatientComponent } from './patient.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { ListPatientComponent } from './list-patient/list-patient.component';

export const patientRoutes: Routes = [
  {
    path: '',
    component: PatientComponent,
    children: [
      { path: 'add-patient/:identification', component: AddPatientComponent },
      { path: 'list-patient', component: ListPatientComponent },
      { path: '**', redirectTo: 'list-patient', pathMatch: 'full' },
    ],
  },
];
