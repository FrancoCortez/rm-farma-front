import { createAction, props } from '@ngrx/store';
import { PatientFormResourceDto } from '../../model/patient/patient-form-resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { PatientResourceDto } from '../../model/patient/patient-resource.dto';

export const createPatient = createAction(
  '[Patient] Create Patient',
  props<{ payload: PatientFormResourceDto }>(),
);
export const createPatientSuccess = createAction(
  '[Patient] Create Patient Success',
  props<{ payload: PatientResourceDto }>(),
);
export const createPatientFailure = createAction(
  '[Patient] Create Patient Failure',
  props<{ error: ErrorModelDto }>(),
);

export const findByIdentificationPatient = createAction(
  '[Patient] Find By Identification Patient',
  props<{ payload: string }>(),
);
export const findByIdentificationPatientSuccess = createAction(
  '[Patient] Find By Identification Patient Success',
  props<{ payload: PatientResourceDto }>(),
);
export const findByIdentificationPatientFailure = createAction(
  '[Patient] Find By Identification Patient Failure',
  props<{ error: ErrorModelDto }>(),
);
