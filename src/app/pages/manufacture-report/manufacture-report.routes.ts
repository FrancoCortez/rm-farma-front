import { Routes } from '@angular/router';
import { ManufactureComponent } from '../manufacture/manufacture.component';
import { ReportProductionComponent } from './report-production/report-production.component';
import { ReportResumeProductionComponent } from './report-resume-production/report-resume-production.component';
import { ReportConcentrationComponent } from './report-concentration/report-concentration.component';
import { ReportHistoryPatientComponent } from './report-history-patient/report-history-patient.component';
import { ReportRecipeBookComponent } from './report-recipe-book/report-recipe-book.component';
import { ReportChemotherapyPreparationFormComponent } from './report-chemotherapy-preparation-form/report-chemotherapy-preparation-form.component';
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
      {
        path: 'report-recipe-book',
        component: ReportRecipeBookComponent,
      },
      {
        path: 'report-chemotherapy-preparation-form',
        component: ReportChemotherapyPreparationFormComponent,
      },
    ],
  },
];
