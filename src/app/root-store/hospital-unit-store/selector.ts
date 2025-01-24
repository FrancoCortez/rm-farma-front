import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';

const selector = (state: RootState) => state.hospitalUnit;

export const selectLoading = createSelector(selector, (state) => state.loading);

export const selectComboHospitalUnit = createSelector(
  selector,
  (state) => state.hospitalUnitCombo,
);
