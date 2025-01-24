import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import * as effects from './effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('complement', reducer),
    EffectsModule.forFeature([effects]),
  ],
})
export class ComplementStoreModule {}
