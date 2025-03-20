import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as action from './actions';

const featureReducer = createReducer(
  initialState,
  on(action.findCustomReport, (state) => ({
    ...state,
    loadingReport: true,
    loadingResumeReport: false,
    updatedSuccessModel: false,
    loadingUpdate: false,
    dataReport: [],
    dataResumeReport: [],
    error: undefined,
  })),
  on(action.findCustomReportSuccess, (state, { payload }) => ({
    ...state,
    loadingReport: false,
    loadingResumeReport: false,
    loadingUpdate: false,
    updatedSuccessModel: false,
    dataReport: payload,
    dataResumeReport: [],
    error: undefined,
  })),
  on(action.findCustomReportFailure, (state, { error }) => ({
    ...state,
    loadingReport: false,
    loadingResumeReport: false,
    loadingUpdate: false,
    updatedSuccessModel: false,
    dataReport: [],
    dataResumeReport: [],
    error: error,
  })),

  on(action.findResumeReport, (state) => ({
    ...state,
    loadingReport: false,
    loadingResumeReport: true,
    updatedSuccessModel: false,
    loadingUpdate: false,
    dataReport: [],
    dataResumeReport: [],
    error: undefined,
  })),
  on(action.findResumeReportSuccess, (state, { payload }) => ({
    ...state,
    loadingReport: false,
    loadingResumeReport: false,
    loadingUpdate: false,
    updatedSuccessModel: false,
    dataReport: [],
    dataResumeReport: payload,
    error: undefined,
  })),
  on(action.findResumeReportFailure, (state, { error }) => ({
    ...state,
    loadingReport: false,
    loadingResumeReport: false,
    loadingUpdate: false,
    updatedSuccessModel: false,
    dataReport: [],
    dataResumeReport: [],
    error: error,
  })),

  on(action.updatedDetailsProduction, (state, { payload }) => ({
    ...state,
    loadingReport: false,
    loadingResumeReport: false,
    loadingUpdate: true,
    updatedSuccessModel: false,
    dataReport: [],
    dataResumeReport: [],
    error: undefined,
  })),

  on(action.updatedDetailsProductionSuccess, (state) => ({
    ...state,
    loadingReport: false,
    loadingResumeReport: false,
    loadingUpdate: false,
    updatedSuccessModel: true,
    dataReport: [],
    dataResumeReport: [],
    error: undefined,
  })),
  on(action.updatedDetailsProductionFailure, (state, { error }) => ({
    ...state,
    loadingReport: false,
    loadingResumeReport: false,
    loadingUpdate: false,
    updatedSuccessModel: false,
    dataReport: [],
    dataResumeReport: [],
    error: error,
  })),

  on(action.resetStore, () => initialState),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
