import * as actions from './actions';
import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';

const featureReducer = createReducer(
  initialState,
  on(actions.loadDoctorFindRut, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
    doctorResource: {},
  })),
  on(actions.loadDoctorFindRutSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    doctorResource: payload,
  })),
  on(actions.loadDoctorFindRutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    doctorResource: {},
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
