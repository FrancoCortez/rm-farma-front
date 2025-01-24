import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';

const selector = (state: RootState) => state.complement;
export const selectLoading = createSelector(selector, (state) => state.loading);
export const selectComplement = createSelector(
  selector,
  (state) => state.complements,
);
