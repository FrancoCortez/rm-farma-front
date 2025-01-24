import { Action, createReducer, on } from '@ngrx/store';
import { initialState, State } from './state';
import * as actions from './actions';

const featureReducer = createReducer(
  initialState,
  on(actions.loadLocalStorage, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
    localValue: null,
  })),
  on(actions.loadLocalStorageSuccess, (state: State, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
    localValue: payload,
  })),
  on(actions.loadMasterOrderDetailsLocal, (state) => ({
    ...state,
    loading: true,
    isLoader: false,
    masterOrderDetails: [],
  })),
  on(
    actions.loadMasterOrderDetailsLocalSuccess,
    (state: State, { payload }) => ({
      ...state,
      loading: false,
      isLoader: true,
      masterOrderDetails: payload.value,
    }),
  ),
  on(actions.saveMasterOrderDetailsLocal, (state: State, { payload }) => ({
    ...state,
    loading: false,
    isLoader: true,
  })),
);

export function reducer(state: State, action: Action) {
  return featureReducer(state, action);
}
