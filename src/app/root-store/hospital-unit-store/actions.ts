import { createAction, props } from '@ngrx/store';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const loadHospitalUnits = createAction(
  '[HospitalUnit] Load HospitalUnits',
);
export const loadHospitalUnitsSuccess = createAction(
  '[HospitalUnit] Load HospitalUnits Success',
  props<{ payload: ComboModelDto[] }>(),
);
export const loadHospitalUnitsFailure = createAction(
  '[HospitalUnit] Load HospitalUnits Failure',
  props<{ error: ErrorModelDto }>(),
);
