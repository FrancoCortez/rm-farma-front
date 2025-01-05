import { createAction, props } from '@ngrx/store';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const loadClinic = createAction('[Clinic] Load Clinic');
export const loadClinicSuccess = createAction(
  '[Clinic] Load Clinic Success',
  props<{ payload: ComboModelDto[] }>(),
);
export const loadClinicFailure = createAction(
  '[Clinic] Load Clinic Failure',
  props<{ error: ErrorModelDto }>(),
);
