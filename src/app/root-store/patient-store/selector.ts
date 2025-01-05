import { RootState } from '../root-state';
import { State } from './state';
import { createSelector } from '@ngrx/store';

const selector = (state: RootState) => state.patient;

export const selectLoading = createSelector(
  selector,
  (state: State) => state.loading,
);

export const selectLoader = createSelector(
  selector,
  (state: State) => state.isLoader,
);

export const selectError = createSelector(
  selector,
  (state: State) => state.error,
);

export const selectPatient = createSelector(
  selector,
  (state: State) => state.patient,
);
