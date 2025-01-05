import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  on(actions.loadClinic, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
  })),
  on(actions.loadClinicSuccess, (state: State, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    clinicCombo: payload,
  })),
  on(actions.loadClinicFailure, (state: State, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    clinicCombo: [],
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
