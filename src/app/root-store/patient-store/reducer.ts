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
    patient: payload,
  })),
  on(actions.createPatientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    patient: {},
  })),
  on(actions.findByIdentificationPatient, (state, { payload }) => ({
    ...state,
    loading: true,
    isLoader: false,
    patient: {},
  })),
  on(actions.findByIdentificationPatientSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    patient: payload,
  })),
  on(actions.findByIdentificationPatientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    patient: {},
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
