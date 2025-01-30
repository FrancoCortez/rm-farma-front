import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as action from './actions';

const featureReducer = createReducer(
  initialState,
  on(action.findCustomReport, (state) => ({
    ...state,
    loadingReport: true,
    dataReport: [],
    error: undefined,
  })),
  on(action.findCustomReportSuccess, (state, { payload }) => ({
    ...state,
    loadingReport: false,
    dataReport: payload,
    error: undefined,
  })),
  on(action.findCustomReportFailure, (state, { error }) => ({
    ...state,
    loadingReport: false,
    dataReport: [],
    error: error,
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
