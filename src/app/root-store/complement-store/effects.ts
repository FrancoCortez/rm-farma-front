import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { ComplementService } from '../../services/complement.service';
import { ComplementResourceDto } from '../../model/complement/complement-resource.dto';

export const findDiagnosisCombo = createEffect(
  (
    actions$ = inject(Actions),
    complementService = inject(ComplementService),
  ) => {
    return actions$.pipe(
      ofType(actions.loadComplement),
      exhaustMap(() =>
        complementService.findAllComplements().pipe(
          map((payload: ComplementResourceDto[]) =>
            actions.loadComplementSuccess({ payload }),
          ),
          catchError((error: ErrorModelDto) =>
            of(actions.loadComplementFailure({ error })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
