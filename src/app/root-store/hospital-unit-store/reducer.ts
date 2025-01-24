import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  on(actions.loadHospitalUnits, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
  })),
  on(actions.loadHospitalUnitsSuccess, (state: State, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    hospitalUnitCombo: payload,
  })),
  on(actions.loadHospitalUnitsFailure, (state: State, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    hospitalUnitCombo: [],
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
