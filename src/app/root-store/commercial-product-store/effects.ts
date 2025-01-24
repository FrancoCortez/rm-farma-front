import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { CommercialProductService } from '../../services/commercial-product.service';
import { CommercialProductResourceDto } from '../../model/commercial-product/commercial-product-resource.dto';

export const findDiagnosisCombo = createEffect(
  (
    actions$ = inject(Actions),
    complementService = inject(CommercialProductService),
  ) => {
    return actions$.pipe(
      ofType(actions.loadCommercialProducts),
      exhaustMap(() =>
        complementService.findAllCommercialProducts().pipe(
          map((payload: CommercialProductResourceDto[]) =>
            actions.loadCommercialProductsSuccess({ payload }),
          ),
          catchError((error: ErrorModelDto) =>
            of(actions.loadCommercialProductsFailure({ error })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
