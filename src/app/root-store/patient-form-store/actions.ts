import { createAction, props } from '@ngrx/store';
import { PatientFormResourceDto } from '../../model/patient/patient-form-resource.dto';
import { DiagnosisPatientFormResourceDto } from '../../model/diagnosis-patient/diagnosis-patient-form-resource.dto';

export const createPatientForm = createAction(
  '[PatientForm] Create PatientForm',
  props<{ payload: PatientFormResourceDto }>(),
);

export const pushDiagnosisPatientForm = createAction(
  '[PatientForm] Push Diagnosis PatientForm',
  props<{ payload: DiagnosisPatientFormResourceDto }>(),
);

export const setDiagnosticCount = createAction(
  '[PatientForm] Set Diagnostic Count',
  props<{ payload?: number }>(),
);

export const pushValidStateForm = createAction(
  '[PatientForm] Push Valid State Form',
  props<{
    payload: {
      patientFormValid: boolean;
      diagnosticFormValid: boolean;
      cyclesFormValid: boolean;
      otherInformationFormValid: boolean;
      doctorFormValid: boolean;
    };
  }>(),
);
