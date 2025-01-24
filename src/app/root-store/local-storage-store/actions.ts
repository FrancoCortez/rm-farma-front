import { createAction, props } from '@ngrx/store';

export const loadLocalStorage = createAction(
  '[LocalStorage] Load LocalStorage',
  props<{ payload: string }>(),
);
export const loadLocalStorageSuccess = createAction(
  '[LocalStorage] Load LocalStorage Success',
  props<{ payload: any }>(),
);

export const saveLocalStorage = createAction(
  '[LocalStorage] Save LocalStorage',
  props<{ payload: { key: string; value: any } }>(),
);

export const cleanLocalStorage = createAction(
  '[LocalStorage] Clean LocalStorage',
  props<{ payload: string }>(),
);

export const loadMasterOrderDetailsLocal = createAction(
  '[MasterOrderDetails] Load MasterOrderDetails Local',
  props<{ payload: 'masterOrder' }>(),
);

export const loadMasterOrderDetailsLocalSuccess = createAction(
  '[MasterOrderDetails] Load MasterOrderDetails Local Success',
  props<{ payload: { key: 'masterOrder'; value: any[] } }>(),
);

export const saveMasterOrderDetailsLocal = createAction(
  '[MasterOrderDetails] Save MasterOrderDetails Local',
  props<{ payload: { key: 'masterOrder'; value: any[] } }>(),
);

export const loadMAsterOrderFormLocal = createAction(
  '[MasterOrderForm] Load MasterOrderForm Local',
  props<{ payload: 'masterOrderForm' }>(),
);

export const loadMasterOrderFormLocalSuccess = createAction(
  '[MasterOrderForm] Load MasterOrderForm Local Success',
  props<{ payload: any }>(),
);
