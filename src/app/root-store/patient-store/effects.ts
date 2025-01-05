import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as actions from './actions';
import { inject } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { PatientFormResourceDto } from '../../model/patient/patient-form-resource.dto';
import { PatientResourceDto } from '../../model/patient/patient-resource.dto';
import { findByIdentificationPatientFailure } from './actions';

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
          map((patient: PatientResourceDto) =>
            actions.findByIdentificationPatientSuccess({ payload: patient }),
          ),
          catchError((errors) =>
            of(
              actions.findByIdentificationPatientFailure({
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
