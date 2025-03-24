import { RootState } from '../root-state';
import { State } from './state';
import { createSelector } from '@ngrx/store';

const selector = (state: RootState) => state.patient;

export const selectLoading = createSelector(
  selector,
  (state: State) => state.loading,
);

export const selectLoader = createSelector(
  selector,
  (state: State) => state.isLoader,
);

export const selectError = createSelector(
  selector,
  (state: State) => state.error,
);

// export const selectPatient = createSelector(selector, (state: State) => {
//   const patient = state.patient || {};
//   return patient && Object.keys(patient).length > 0 ? patient : {};
// });

export const selectPatient = createSelector(
  selector,
  (state: State) => state.patient,
);

export const selectSuccessCreateOrUpdate = createSelector(
  selector,
  (state: State) => state.successCreateOrUpdate,
);

export const selectPatients = createSelector(
  selector,
  (state: State) => state.patients,
);

export const selectErrorForProduction = createSelector(
  selector,
  (state: State) => state.errorForProduction,
);
