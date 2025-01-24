import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  on(actions.loadCommercialProducts, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
    error: undefined,
    commercialProducts: [],
  })),
  on(actions.loadCommercialProductsSuccess, (state: State, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    commercialProducts: payload,
  })),
  on(actions.loadCommercialProductsFailure, (state: State, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    commercialProducts: [],
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
