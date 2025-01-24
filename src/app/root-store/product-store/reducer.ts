import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  on(actions.loadProduct, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
    error: undefined,
    products: [],
  })),
  on(actions.loadProductSuccess, (state: State, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    products: payload,
  })),
  on(actions.loadProductFailure, (state: State, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    products: [],
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
