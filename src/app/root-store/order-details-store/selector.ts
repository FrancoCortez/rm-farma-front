import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';
import { State } from './state';

const selector = (state: RootState) => state.orderDetails;

export const selectLoadingDataReport = createSelector(
  selector,
  (state: State) => state.loadingReport,
);

export const selectDataReport = createSelector(
  selector,
  (state: State) => state.dataReport,
);
