import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  // on(actions.createPatientForm, (state, { payload }) => {
  //   const value = payload;
  //   if (
  //     state?.patientFormCreate?.diagnosisPatient &&
  //     state.patientFormCreate.diagnosisPatient.length > 0
  //   ) {
  //     value.diagnosisPatient = state.patientFormCreate.diagnosisPatient;
  //   }
  //   console.log('reducer', {
  //     ...state,
  //     patientFormCreate: { ...state.patientFormCreate, value },
  //   });
  //   return {
  //     ...state,
  //     patientFormCreate: { ...state.patientFormCreate, value },
  //   };
  // }),
  on(actions.createPatientForm, (state, { payload }) => {
    const updatedPatientFormCreate = {
      ...payload,
      diagnosisPatient:
        (state?.patientFormCreate?.diagnosisPatient?.length ?? 0) > 0
          ? state.patientFormCreate.diagnosisPatient
          : payload.diagnosisPatient,
    };
    console.log('reducer', {
      ...state,
      patientFormCreate: updatedPatientFormCreate,
    });
    return {
      ...state,
      patientFormCreate: updatedPatientFormCreate,
    };
  }),
  on(actions.pushValidStateForm, (state, { payload }) => ({
    ...state,
    patientFormValid: payload.patientFormValid,
    diagnosticFormValid: payload.diagnosticFormValid,
    cyclesFormValid: payload.cyclesFormValid,
    otherInformationFormValid: payload.otherInformationFormValid,
    doctorFormValid: payload.doctorFormValid,
  })),
  on(actions.pushDiagnosisPatientForm, (state, { payload }) => {
    const existingDiagnosis = state.patientFormCreate.diagnosisPatient?.find(
      (diagnosis) => diagnosis.diagnosis === payload.diagnosis,
    );
    return {
      ...state,
      patientFormCreate: {
        ...state.patientFormCreate,
        diagnosisPatient: existingDiagnosis
          ? state.patientFormCreate.diagnosisPatient
          : [...(state.patientFormCreate.diagnosisPatient || []), payload],
      },
    };
  }),
  on(actions.setDiagnosticCount, (state, { payload }) => ({
    ...state,
    diagnosticCount: payload || 0,
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
