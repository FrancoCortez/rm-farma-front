import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';

const selector = (state: RootState) => state.diagnosis;

export const selectLoading = createSelector(selector, (state) => state.loading);
export const selectComboDiagnosis = createSelector(
  selector,
  (state) => state.diagnosisCombo,
);
