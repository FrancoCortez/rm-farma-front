import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { HospitalUnitService } from '../../services/hospital-unit.service';

export const findAllHospitalUnit = createEffect(
  (
    actions$ = inject(Actions),
    hospitalUnitService = inject(HospitalUnitService),
  ) => {
    return actions$.pipe(
      ofType(actions.loadHospitalUnits),
      exhaustMap(() =>
        hospitalUnitService.findAllHospitalUnit().pipe(
          map((payload: ComboModelDto[]) =>
            actions.loadHospitalUnitsSuccess({ payload }),
          ),
          catchError((error: ErrorModelDto) =>
            of(actions.loadHospitalUnitsFailure({ error })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
