import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';
import { State } from './state';

const selector = (state: RootState) => state.clinic;

export const selectLoading = createSelector(
  selector,
  (state: State) => state.loading,
);

export const selectComboClinic = createSelector(
  selector,
  (state: State) => state.clinicCombo,
);
