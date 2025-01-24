import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { ServicesService } from '../../services/services.service';

export const findSchemaCombo = createEffect(
  (actions$ = inject(Actions), servicesService = inject(ServicesService)) => {
    return actions$.pipe(
      ofType(actions.loadService),
      exhaustMap(() =>
        servicesService.findAllServicesWithCombo().pipe(
          map((payload: ComboModelDto[]) =>
            actions.loadServiceSuccess({ payload }),
          ),
          catchError((error: ErrorModelDto) =>
            of(actions.loadServiceFailure({ error })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
