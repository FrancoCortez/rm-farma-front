import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';

const selector = (state: RootState) => state.via;

export const selectorLoading = createSelector(
  selector,
  (state) => state.loading,
);

export const selectorViaCombo = createSelector(
  selector,
  (state) => state.viaCombo,
);
