import { createAction, props } from '@ngrx/store';
import { DoctorResourceDto } from '../../model/doctor/doctor-resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { DoctorCreateResourceDto } from '../../model/doctor/doctor-create-resource.dto';

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

export const loadAllDoctors = createAction('[Doctor] Load All Doctors');
export const loadAllDoctorsSuccess = createAction(
  '[Doctor] Load All Doctors Success',
  props<{ payload: DoctorResourceDto[] }>(),
);
export const loadAllDoctorsFailure = createAction(
  '[Doctor] Load All Doctors Failure',
  props<{ error: ErrorModelDto }>(),
);

export const createDoctor = createAction(
  '[Doctor] Create Doctor',
  props<{ payload: DoctorCreateResourceDto }>(),
);
export const createDoctorSuccess = createAction(
  '[Doctor] Create Doctor Success',
  props<{ payload: DoctorResourceDto }>(),
);
export const createDoctorFailure = createAction(
  '[Doctor] Create Doctor Failure',
  props<{ error: ErrorModelDto }>(),
);
