import { RootState } from '../root-state';
import { State } from './state';
import { createSelector } from '@ngrx/store';

const selector = (state: RootState) => state.doctor;
export const selectLoading = createSelector(
  selector,
  (state: State) => state.loading,
);

export const selectDoctor = createSelector(
  selector,
  (state: State) => state.doctorResource,
);
export const selectSuccessLoadAllDoctors = createSelector(
  selector,
  (state: State) => state.successLoadAllDoctors,
);
export const selectDoctorResources = createSelector(
  selector,
  (state: State) => state.doctorResources,
);

export const selectCreateDoctor = createSelector(
  selector,
  (state: State) => state.createDoctorResource,
);
