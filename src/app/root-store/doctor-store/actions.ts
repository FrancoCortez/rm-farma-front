import { createAction, props } from '@ngrx/store';
import { DoctorResourceDto } from '../../model/doctor/doctor-resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const loadDoctorFindRut = createAction(
  '[Doctor] Load Doctor Find Rut',
  props<{ payload: string }>(),
);
export const loadDoctorFindRutSuccess = createAction(
  '[Doctor] Load Doctor Find Rut Success',
  props<{ payload: DoctorResourceDto }>(),
);
export const loadDoctorFindRutFailure = createAction(
  '[Doctor] Load Doctor Find Rut Failure',
  props<{ error: ErrorModelDto }>(),
);
