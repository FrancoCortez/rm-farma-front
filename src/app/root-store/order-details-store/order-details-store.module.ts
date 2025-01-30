import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './reducer';
import * as effect from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('orderDetails', reducer),
    EffectsModule.forFeature([effect]),
  ],
})
export class OrderDetailsStoreModule {}
