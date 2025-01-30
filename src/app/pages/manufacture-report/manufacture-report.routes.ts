import { Routes } from '@angular/router';
import { ManufactureComponent } from '../manufacture/manufacture.component';
import { ReportProductionComponent } from './report-production/report-production.component';
export const manufactureReportRoutes: Routes = [
  {
    path: '',
    component: ManufactureComponent,
    children: [
      { path: 'report-production', component: ReportProductionComponent },
    ],
  },
];
