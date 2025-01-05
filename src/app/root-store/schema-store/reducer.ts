import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  on(actions.loadSchema, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
  })),
  on(actions.loadSchemaSuccess, (state: State, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    schemaCombo: payload,
  })),
  on(actions.loadSchemaFailure, (state: State, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    schemaCombo: [],
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
