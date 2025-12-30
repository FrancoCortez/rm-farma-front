import { Routes } from '@angular/router';
import { ManufactureComponent } from '../manufacture/manufacture.component';
import { ReportProductionComponent } from './report-production/report-production.component';
import { ReportResumeProductionComponent } from './report-resume-production/report-resume-production.component';
import { ReportConcentrationComponent } from './report-concentration/report-concentration.component';
import { ReportHistoryPatientComponent } from './report-history-patient/report-history-patient.component';
export const manufactureReportRoutes: Routes = [
  {
    path: '',
    component: ManufactureComponent,
    children: [
      { path: 'report-production', component: ReportProductionComponent },
      {
        path: 'report-resume-production',
        component: ReportResumeProductionComponent,
      },
      { path: 'report-concentration', component: ReportConcentrationComponent },
      {
        path: 'report-historic-patient',
        component: ReportHistoryPatientComponent,
      },
    ],
  },
];
