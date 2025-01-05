import { createAction, props } from '@ngrx/store';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const loadDiagnosis = createAction('[Diagnosis] Load Diagnosis');
export const loadDiagnosisSuccess = createAction(
  '[Diagnosis] Load Diagnosis Success',
  props<{ payload: ComboModelDto[] }>(),
);
export const loadDiagnosisFailure = createAction(
  '[Diagnosis] Load Diagnosis Failure',
  props<{ error: ErrorModelDto }>(),
);
