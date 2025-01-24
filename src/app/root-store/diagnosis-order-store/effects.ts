import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { DiagnosisOrderStateService } from '../../services/diagnosis-order-state.service';
import { DiagnosisOrderStateFormResourceDto } from '../../model/diagnosis-order-state/diagnosis-order-state-form-resource.dto';

export const createPatient = createEffect(
  (
    actions$ = inject(Actions),
    diagnosisOrderStateService = inject(DiagnosisOrderStateService),
  ) => {
    return actions$.pipe(
      ofType(actions.createDiagnosisOrder),
      exhaustMap(
        ({ payload }: { payload: DiagnosisOrderStateFormResourceDto }) =>
          diagnosisOrderStateService.createDiagnosisOrder(payload).pipe(
            map(() => actions.createDiagnosisOrderSuccess()),
            catchError((errors) =>
              of(actions.createDiagnosisOrderFailure({ error: errors.error })),
            ),
          ),
      ),
    );
  },
  { functional: true },
);
