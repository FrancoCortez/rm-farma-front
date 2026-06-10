import { Routes } from '@angular/router';
import { SchemasComponent } from './schemas/schemas.component';
import { ActiveIngredientComponent } from './active-ingredient/active-ingredient.component';
import { CommercialProductComponent } from './commercial-product/commercial-product.component';
import { DoctorComponent } from './doctor/doctor.component';

export default [
  { path: 'schemas', component: SchemasComponent },
  { path: 'pa', component: ActiveIngredientComponent },
  { path: 'commercial-product', component: CommercialProductComponent },
  { path: 'doctor', component: DoctorComponent },
] as Routes;
