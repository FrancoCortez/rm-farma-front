import { createAction, props } from '@ngrx/store';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const loadSchema = createAction('[Schema] Load Schema');
export const loadSchemaSuccess = createAction(
  '[Schema] Load Schema Success',
  props<{ payload: ComboModelDto[] }>(),
);
export const loadSchemaFailure = createAction(
  '[Schema] Load Schema Failure',
  props<{ error: ErrorModelDto }>(),
);
