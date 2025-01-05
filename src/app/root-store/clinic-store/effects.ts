import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { ClinicService } from '../../services/clinic.service';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const findClinicCombo = createEffect(
  (actions$ = inject(Actions), clinicService = inject(ClinicService)) => {
    return actions$.pipe(
      ofType(actions.loadClinic),
      exhaustMap(() =>
        clinicService.findAllClinicWithCombo().pipe(
          map((payload: ComboModelDto[]) =>
            actions.loadClinicSuccess({ payload }),
          ),
          catchError((error: ErrorModelDto) =>
            of(actions.loadClinicFailure({ error })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
