import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { IsapreService } from '../../services/isapre.service';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const findIsapreCombo = createEffect(
  (actions$ = inject(Actions), isapreService = inject(IsapreService)) => {
    return actions$.pipe(
      ofType(actions.loadIsapre),
      exhaustMap(() =>
        isapreService.findAllIsapreWithCombo().pipe(
          map((payload: ComboModelDto[]) =>
            actions.loadIsapreSuccess({ payload }),
          ),
          catchError((error: ErrorModelDto) =>
            of(actions.loadIsapreFailure({ error })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
