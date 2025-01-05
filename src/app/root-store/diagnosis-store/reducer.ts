import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  on(actions.loadDiagnosis, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
  })),
  on(actions.loadDiagnosisSuccess, (state: State, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    diagnosisCombo: payload,
  })),
  on(actions.loadDiagnosisFailure, (state: State, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    diagnosisCombo: [],
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
