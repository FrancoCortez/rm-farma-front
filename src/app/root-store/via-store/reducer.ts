import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  on(actions.loadVia, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
    error: undefined,
    viaCombo: [],
  })),
  on(actions.loadViaSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    viaCombo: payload,
  })),
  on(actions.loadViaFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    viaCombo: [],
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
