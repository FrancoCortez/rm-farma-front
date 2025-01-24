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
  props<{ error?: ErrorModelDto }>(),
);

export const findByIdentificationPatientReportError = createAction(
  '[Patient] Find By Identification Patient Report Error',
  props<{ payload: string }>(),
);
export const findByIdentificationPatientReportErrorSuccess = createAction(
  '[Patient] Find By Identification Patient Success Report Error',
  props<{ payload: PatientResourceDto }>(),
);
export const findByIdentificationPatientReportErrorFailure = createAction(
  '[Patient] Find By Identification Patient Failure Report Error',
  props<{ error?: ErrorModelDto }>(),
);

export const selectSuccessCreateOrUpdateChange = createAction(
  '[Patient] Select Success Create Or Update Change',
  props<{ payload: boolean }>(),
);

export const findAllPatients = createAction('[Patient] Find All Patients');
export const findAllPatientsSuccess = createAction(
  '[Patient] Find All Patients Success',
  props<{ payload: PatientResourceDto[] }>(),
);
export const findAllPatientsFailure = createAction(
  '[Patient] Find All Patients Failure',
  props<{ error: ErrorModelDto }>(),
);

export const resetState = createAction('[Patient] Reset State');
