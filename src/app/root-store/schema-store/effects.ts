import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { SchemaService } from '../../services/schema.service';

export const findSchemaCombo = createEffect(
  (actions$ = inject(Actions), schemaService = inject(SchemaService)) => {
    return actions$.pipe(
      ofType(actions.loadSchema),
      exhaustMap(() =>
        schemaService.findAllSchemasWithCombo().pipe(
          map((payload: ComboModelDto[]) =>
            actions.loadSchemaSuccess({ payload }),
          ),
          catchError((error: ErrorModelDto) =>
            of(actions.loadSchemaFailure({ error })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
