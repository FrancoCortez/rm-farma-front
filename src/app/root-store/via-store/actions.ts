import { createAction, props } from '@ngrx/store';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { ComboModelDto } from '../../utils/models/combo-model.dto';

export const loadVia = createAction('[Via] Load Via');
export const loadViaSuccess = createAction(
  '[Via] Load Via Success',
  props<{ payload: ComboModelDto[] }>(),
);
export const loadViaFailure = createAction(
  '[Via] Load Via Failure',
  props<{ error: ErrorModelDto }>(),
);
