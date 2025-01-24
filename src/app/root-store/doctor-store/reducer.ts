import * as actions from './actions';
import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';

const featureReducer = createReducer(
  initialState,
  on(actions.loadDoctorFindRut, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
    doctorResource: {},
  })),
  on(actions.loadDoctorFindRutSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    doctorResource: payload,
  })),
  on(actions.loadDoctorFindRutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    doctorResource: {},
  })),
  on(actions.loadAllDoctors, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
    successLoadAllDoctors: false,
    doctorResource: {},
  })),
  on(actions.loadAllDoctorsSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    successLoadAllDoctors: true,
    doctorResources: payload,
  })),
  on(actions.loadAllDoctorsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    successLoadAllDoctors: false,
    error,
    doctorResources: [],
  })),
  on(actions.createDoctor, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
    createDoctorResource: {},
  })),
  on(actions.createDoctorSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    createDoctorResource: payload,
    doctorResources: [...state.doctorResources, payload],
  })),
  on(actions.createDoctorFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    createDoctorResource: {},
    error,
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
