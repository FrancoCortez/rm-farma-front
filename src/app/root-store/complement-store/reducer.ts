import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  on(actions.loadComplement, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
    error: undefined,
    complements: [],
  })),
  on(actions.loadComplementSuccess, (state: State, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    complements: payload,
  })),
  on(actions.loadComplementFailure, (state: State, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    complements: [],
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
