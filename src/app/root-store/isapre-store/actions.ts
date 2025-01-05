import { createAction, props } from '@ngrx/store';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const loadIsapre = createAction('[Isapre] Load Isapre');
export const loadIsapreSuccess = createAction(
  '[Isapre] Load Isapre Success',
  props<{ payload: ComboModelDto[] }>(),
);
export const loadIsapreFailure = createAction(
  '[Isapre] Load Isapre Failure',
  props<{ error: ErrorModelDto }>(),
);
