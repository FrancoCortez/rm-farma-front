import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { DiagnosisService } from '../../services/diagnosis.service';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const findDiagnosisCombo = createEffect(
  (actions$ = inject(Actions), diagnosisService = inject(DiagnosisService)) => {
    return actions$.pipe(
      ofType(actions.loadDiagnosis),
      exhaustMap(() =>
        diagnosisService.findAllDiagnosisWithCombo().pipe(
          map((payload: ComboModelDto[]) =>
            actions.loadDiagnosisSuccess({ payload }),
          ),
          catchError((error: ErrorModelDto) =>
            of(actions.loadDiagnosisFailure({ error })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
