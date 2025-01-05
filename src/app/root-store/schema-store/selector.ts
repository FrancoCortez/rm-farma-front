import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';
import { State } from './state';

const selector = (state: RootState) => state.schema;

export const selectLoading = createSelector(
  selector,
  (state: State) => state.loading,
);

export const selectComboSchema = createSelector(
  selector,
  (state: State) => state.schemaCombo,
);
