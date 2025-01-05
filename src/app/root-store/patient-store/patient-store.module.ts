import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as effect from './effects';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('patient', reducer),
    EffectsModule.forFeature([effect]),
  ],
})
export class PatientStoreModule {}
