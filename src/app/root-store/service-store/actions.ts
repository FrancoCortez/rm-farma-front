import { createAction, props } from '@ngrx/store';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const loadService = createAction('[Service] Load Service');
export const loadServiceSuccess = createAction(
  '[Service] Load Service Success',
  props<{ payload: ComboModelDto[] }>(),
);
export const loadServiceFailure = createAction(
  '[Service] Load Service Failure',
  props<{ error: ErrorModelDto }>(),
);
