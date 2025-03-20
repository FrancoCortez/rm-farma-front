import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  on(actions.createPatient, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
  })),
  on(actions.createPatientSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    successCreateOrUpdate: true,
    patient: {},
  })),
  on(actions.createPatientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    successCreateOrUpdate: false,
    error,
    patient: {},
  })),
  on(actions.findByIdentificationPatient, (state, { payload }) => ({
    ...state,
    loading: true,
    isLoader: false,
    successCreateOrUpdate: false,
    patient: {},
  })),
  on(actions.findByIdentificationPatientSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    successCreateOrUpdate: false,
    patient: payload,
  })),
  on(actions.findByIdentificationPatientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    successCreateOrUpdate: false,
    error,
    patient: {},
  })),
  on(actions.findByIdentificationPatientReportError, (state, { payload }) => ({
    ...state,
    loading: true,
    isLoader: false,
    error: undefined,
    errorForProduction: undefined,
    successCreateOrUpdate: false,
    patient: {},
  })),
  on(
    actions.findByIdentificationPatientReportErrorSuccess,
    (state, { payload }) => ({
      ...state,
      loading: false,
      isLoader: true,
      error: undefined,
      successCreateOrUpdate: false,
      errorForProduction: undefined,
      patient: payload,
    }),
  ),
  on(
    actions.findByIdentificationPatientReportErrorFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      isLoader: false,
      successCreateOrUpdate: false,
      errorForProduction: error,
      patient: {},
    }),
  ),

  on(actions.selectSuccessCreateOrUpdateChange, (state, { payload }) => ({
    ...state,
    successCreateOrUpdate: payload,
  })),

  on(actions.findAllPatients, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
    successCreateOrUpdate: false,
    patients: [],
    patient: {},
  })),
  on(actions.findAllPatientsSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    patient: {},
    successCreateOrUpdate: false,
    isLoader: true,
    patients: payload,
  })),
  on(actions.findAllPatientsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    successCreateOrUpdate: false,
    patient: {},
    error,
    patients: [],
  })),

  on(actions.resetState, (state) => ({
    ...state,
    loading: false,
    isLoader: false,
    error: undefined,
    errorForProduction: undefined,
    patient: {},
    patients: [],
    successCreateOrUpdate: false,
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
