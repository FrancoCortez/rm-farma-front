import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';
import { State } from './state';

const selector = (state: RootState) => state.isapre;

export const selectLoading = createSelector(
  selector,
  (state: State) => state.loading,
);
export const selectComboIsapre = createSelector(
  selector,
  (state: State) => state.isapreCombo,
);
