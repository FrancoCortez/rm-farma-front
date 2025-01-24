import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import * as effect from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('hospitalUnit', reducer),
    EffectsModule.forFeature([effect]),
  ],
})
export class HospitalUnitStoreModule {}
