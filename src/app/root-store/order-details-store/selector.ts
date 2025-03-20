import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';
import { State } from './state';

const selector = (state: RootState) => state.orderDetails;

export const selectLoadingDataReport = createSelector(
  selector,
  (state: State) => state.loadingReport,
);

export const selectLoadingResumeReport = createSelector(
  selector,
  (state: State) => state.loadingResumeReport,
);

export const selectDataReport = createSelector(
  selector,
  (state: State) => state.dataReport,
);

export const selectDataResumeReport = createSelector(
  selector,
  (state: State) => state.dataResumeReport,
);

export const selectLoadingUpdate = createSelector(
  selector,
  (state: State) => state.loadingUpdate,
);

export const selectUpdatedSuccessModel = createSelector(
  selector,
  (state: State) => state.updatedSuccessModel,
);
