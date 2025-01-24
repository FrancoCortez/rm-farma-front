import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';

const selector = (state: RootState) => state.diagnosisOrder;
export const selectCreateSuccessFlag = createSelector(
  selector,
  (state) => state.createSuccess,
);
