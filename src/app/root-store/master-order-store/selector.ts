import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';
import { State } from './state';

const selector = (state: RootState) => state.masterOrder;
export const selectMasterOrders = createSelector(
  selector,
  (state: State) => state.masterOrders,
);
export const successCreateOrUpdate = createSelector(
  selector,
  (state: State) => state.successCreateOrUpdate,
);
