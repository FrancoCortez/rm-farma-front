import { createAction, props } from '@ngrx/store';
import { ComplementResourceDto } from '../../model/complement/complement-resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const loadComplement = createAction('[Complement] Load Complement');
export const loadComplementSuccess = createAction(
  '[Complement] Load Complement Success',
  props<{ payload: ComplementResourceDto[] }>(),
);
export const loadComplementFailure = createAction(
  '[Complement] Load Complement Failure',
  props<{ error: ErrorModelDto }>(),
);
