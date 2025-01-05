import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  on(actions.loadIsapre, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
  })),
  on(actions.loadIsapreSuccess, (state: State, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    isapreCombo: payload,
  })),
  on(actions.loadIsapreFailure, (state: State, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    isapreCombo: [],
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
