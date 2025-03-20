import { Routes } from '@angular/router';
import { PatientComponent } from './patient.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { ListPatientComponent } from './list-patient/list-patient.component';
import { AddPatientV2Component } from './add-patient-v2/add-patient-v2.component';

export const patientRoutes: Routes = [
  {
    path: '',
    component: PatientComponent,
    children: [
      // { path: 'add-patient/:identification', component: AddPatientComponent },
      { path: 'add-patient/:identification', component: AddPatientV2Component },
      { path: 'list-patient', component: ListPatientComponent },
      { path: '**', redirectTo: 'list-patient', pathMatch: 'full' },
    ],
  },
];
