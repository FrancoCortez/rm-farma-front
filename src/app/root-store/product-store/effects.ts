import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { ProductService } from '../../services/product.service';

export const findProduct = createEffect(
  (actions$ = inject(Actions), productService = inject(ProductService)) => {
    return actions$.pipe(
      ofType(actions.loadProduct),
      exhaustMap(() =>
        productService.findAllProducts().pipe(
          map((payload: ComboModelDto[]) =>
            actions.loadProductSuccess({ payload }),
          ),
          catchError((error: ErrorModelDto) =>
            of(actions.loadProductFailure({ error })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
