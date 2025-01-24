import { Routes } from '@angular/router';
import { ManufactureComponent } from './manufacture.component';
import { AddManufactureComponent } from './add-manufacture/add-manufacture.component';
import { ListManufactureComponent } from './list-manufacture/list-manufacture.component';

export const manufactureRoutes: Routes = [
  {
    path: '',
    component: ManufactureComponent,
    children: [
      { path: 'new-production', component: AddManufactureComponent },
      { path: 'list-production', component: ListManufactureComponent },
    ],
  },
];
