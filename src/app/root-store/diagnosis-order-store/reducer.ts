import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  on(actions.createDiagnosisOrder, (state, { payload }) => ({
    ...state,
    loading: true,
    isLoader: false,
    createSuccess: false,
    error: undefined,
  })),
  on(actions.createDiagnosisOrderSuccess, (state) => ({
    ...state,
    loading: false,
    isLoader: true,
    createSuccess: true,
  })),
  on(actions.createDiagnosisOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    createSuccess: false,
    error,
  })),
  on(actions.setStatusCreateDiagnosisOrder, (state, { payload }) => ({
    ...state,
    createSuccess: payload,
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
