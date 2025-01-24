import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import * as effects from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('commercialProduct', reducer),
    EffectsModule.forFeature([effects]),
  ],
})
export class CommercialProductStoreModule {}
