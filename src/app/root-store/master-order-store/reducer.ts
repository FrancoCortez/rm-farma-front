import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as action from './actions';
import * as actions from '../patient-store/actions';

const featureReducer = createReducer(
  initialState,
  on(action.loadMasterOrder, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
  })),
  on(action.loadMasterOrderSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    masterOrders: payload,
  })),
  on(action.loadMasterOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    error,
    masterOrders: [],
  })),
  on(action.createMasterOrder, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
    successCreateOrUpdate: false,
  })),
  on(action.createMasterOrderSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    successCreateOrUpdate: true,
    // masterOrders: [...state.masterOrders, payload],
  })),
  on(action.createMasterOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoader: false,
    successCreateOrUpdate: false,
    error,
  })),
  on(actions.selectSuccessCreateOrUpdateChange, (state, { payload }) => ({
    ...state,
    successCreateOrUpdate: payload,
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
