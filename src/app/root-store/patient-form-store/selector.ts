import { RootState } from '../root-state';
import { createSelector } from '@ngrx/store';

const selector = (state: RootState) => state.patientForm;

export const getFormPatient = createSelector(
  selector,
  (state) => state.patientFormCreate,
);

export const allStateValidForm = createSelector(selector, (state) => ({
  patientFormValid: state.patientFormValid,
  diagnosticFormValid: state.diagnosticFormValid,
  cyclesFormValid: state.cyclesFormValid,
  otherInformationFormValid: state.otherInformationFormValid,
  doctorFormValid: state.doctorFormValid,
}));

export const getDiagnosisCount = createSelector(
  selector,
  (state) => state.diagnosticCount,
);
