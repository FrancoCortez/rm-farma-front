import { createAction, props } from '@ngrx/store';
import { MasterOrderResourceDto } from '../../model/master-order/master-order-resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { MasterOrderFormResourceDto } from '../../model/master-order/master-order-form-resource.dto';

export const loadMasterOrder = createAction(
  '[MasterOrder] Load MasterOrder',
  props<{ payload: { searchDay: Date; searchIdentification: string } }>(),
);
export const loadMasterOrderSuccess = createAction(
  '[MasterOrder] Load MasterOrder Success',
  props<{ payload: MasterOrderResourceDto[] }>(),
);
export const loadMasterOrderFailure = createAction(
  '[MasterOrder] Load MasterOrder Failure',
  props<{ error: ErrorModelDto }>(),
);

export const createMasterOrder = createAction(
  '[MasterOrder] Create MasterOrder',
  props<{ payload: MasterOrderFormResourceDto[] }>(),
);
export const createMasterOrderSuccess = createAction(
  '[MasterOrder] Create MasterOrder Success',
  props<{ payload: MasterOrderResourceDto }>(),
);
export const createMasterOrderFailure = createAction(
  '[MasterOrder] Create MasterOrder Failure',
  props<{ error: ErrorModelDto }>(),
);

export const selectSuccessCreateOrUpdateChange = createAction(
  '[Patient] Select Success Create Or Update Change',
  props<{ payload: boolean }>(),
);
