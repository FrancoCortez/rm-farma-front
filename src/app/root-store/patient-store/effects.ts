import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as actions from './actions';
import * as patientFormActions from '../patient-form-store/actions';
import { inject } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { catchError, exhaustMap, map, mergeMap, of } from 'rxjs';
import { PatientFormResourceDto } from '../../model/patient/patient-form-resource.dto';
import { PatientResourceDto } from '../../model/patient/patient-resource.dto';

export const createPatient = createEffect(
  (actions$ = inject(Actions), patientService = inject(PatientService)) => {
    return actions$.pipe(
      ofType(actions.createPatient),
      exhaustMap(({ payload }: { payload: PatientFormResourceDto }) =>
        patientService.createPatient(payload).pipe(
          map((patient: PatientResourceDto) =>
            actions.createPatientSuccess({ payload: patient }),
          ),
          catchError((errors) =>
            of(actions.createPatientFailure({ error: errors.error })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const findByIdentificationPatient = createEffect(
  (actions$ = inject(Actions), patientService = inject(PatientService)) => {
    return actions$.pipe(
      ofType(actions.findByIdentificationPatient),
      exhaustMap(({ payload }: { payload: string }) =>
        patientService.findByIdentificationPatent(payload).pipe(
          mergeMap((patient: PatientResourceDto) => {
            return [
              actions.findByIdentificationPatientSuccess({ payload: patient }),
              patientFormActions.setDiagnosticCount({
                payload: patient?.diagnosisPatient?.length,
              }),
            ];
          }),
          catchError((errors) =>
            of(
              actions.findByIdentificationPatientFailure({
                error: undefined,
              }),
              patientFormActions.resetAllInitialState(),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true, dispatch: true },
);

export const findByIdentificationPatientReportError = createEffect(
  (actions$ = inject(Actions), patientService = inject(PatientService)) => {
    return actions$.pipe(
      ofType(actions.findByIdentificationPatientReportError),
      exhaustMap(({ payload }: { payload: string }) =>
        patientService.findByIdentificationPatent(payload).pipe(
          map((patient: PatientResourceDto) =>
            actions.findByIdentificationPatientReportErrorSuccess({
              payload: patient,
            }),
          ),
          catchError((errors) =>
            of(
              actions.findByIdentificationPatientReportErrorFailure({
                error: errors.error,
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const findAllPatients = createEffect(
  (actions$ = inject(Actions), patientService = inject(PatientService)) => {
    return actions$.pipe(
      ofType(actions.findAllPatients),
      exhaustMap(() =>
        patientService.findAllPatients().pipe(
          map((patients: PatientResourceDto[]) =>
            actions.findAllPatientsSuccess({ payload: patients }),
          ),
          catchError((errors) =>
            of(
              actions.findAllPatientsFailure({
                error: errors,
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
