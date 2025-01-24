import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';

const selector = (state: RootState) => state.service;

export const selectorLoading = createSelector(
  selector,
  (state) => state.loading,
);
export const selectorServiceCombo = createSelector(
  selector,
  (state) => state.serviceCombo,
);
