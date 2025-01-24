import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { ViaService } from '../../services/via.service';

export const findViaCombo = createEffect(
  (actions$ = inject(Actions), viaService = inject(ViaService)) => {
    return actions$.pipe(
      ofType(actions.loadVia),
      exhaustMap(() =>
        viaService.findAllViaWithCombo().pipe(
          map((payload: ComboModelDto[]) =>
            actions.loadViaSuccess({ payload }),
          ),
          catchError((error: ErrorModelDto) =>
            of(actions.loadViaFailure({ error })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
