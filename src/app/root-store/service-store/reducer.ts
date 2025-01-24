import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  on(actions.loadService, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
  })),
  on(actions.loadServiceSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    serviceCombo: payload,
  })),
  on(actions.loadServiceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    serviceCombo: [],
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
