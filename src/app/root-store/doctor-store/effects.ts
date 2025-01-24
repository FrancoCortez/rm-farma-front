import * as actions from './actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { DoctorService } from '../../services/doctor.service';
import { DoctorResourceDto } from '../../model/doctor/doctor-resource.dto';

export const findDoctorByRut = createEffect(
  (actions$ = inject(Actions), doctorService = inject(DoctorService)) => {
    return actions$.pipe(
      ofType(actions.loadDoctorFindRut),
      exhaustMap(({ payload }: { payload: string }) =>
        doctorService.findDoctorByRut(payload).pipe(
          map((doctor: DoctorResourceDto) =>
            actions.loadDoctorFindRutSuccess({ payload: doctor }),
          ),
          catchError((errors) =>
            of(
              actions.loadDoctorFindRutFailure({
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

export const findAllDoctor = createEffect(
  (actions$ = inject(Actions), doctorService = inject(DoctorService)) => {
    return actions$.pipe(
      ofType(actions.loadAllDoctors),
      exhaustMap(() =>
        doctorService.findAllDoctors().pipe(
          map((doctor: DoctorResourceDto[]) =>
            actions.loadAllDoctorsSuccess({ payload: doctor }),
          ),
          catchError((errors) =>
            of(
              actions.loadAllDoctorsFailure({
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

export const createDoctor = createEffect(
  (actions$ = inject(Actions), doctorService = inject(DoctorService)) => {
    return actions$.pipe(
      ofType(actions.createDoctor),
      exhaustMap(({ payload }) =>
        doctorService.createDoctor(payload).pipe(
          map((doctor: DoctorResourceDto) =>
            actions.createDoctorSuccess({ payload: doctor }),
          ),
          catchError((errors) =>
            of(
              actions.createDoctorFailure({
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
