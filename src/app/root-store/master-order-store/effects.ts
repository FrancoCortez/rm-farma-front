import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { catchError, exhaustMap, map, mergeMap, of } from 'rxjs';
import { MasterOrderService } from '../../services/master-order.service';
import { MasterOrderResourceDto } from '../../model/master-order/master-order-resource.dto';
import { MasterOrderFormResourceDto } from '../../model/master-order/master-order-form-resource.dto';

export const findAllMasterOrder = createEffect(
  (
    actions$ = inject(Actions),
    masterOrderService = inject(MasterOrderService),
  ) => {
    return actions$.pipe(
      ofType(actions.loadMasterOrder),
      exhaustMap(({ payload }) =>
        masterOrderService
          .findAllMasterOrders(payload.searchDay, payload.searchIdentification)
          .pipe(
            map((masterOrders: MasterOrderResourceDto[]) =>
              actions.loadMasterOrderSuccess({ payload: masterOrders }),
            ),
            catchError((errors) =>
              of(
                actions.loadMasterOrderFailure({
                  error: errors,
                }),
              ),
            ),
          ),
      ),
    );
  },
  { functional: true },
);

export const createMasterOrder = createEffect(
  (
    actions$ = inject(Actions),
    masterOrderService = inject(MasterOrderService),
  ) => {
    return actions$.pipe(
      ofType(actions.createMasterOrder),
      exhaustMap(({ payload }: { payload: MasterOrderFormResourceDto[] }) =>
        masterOrderService.createMasterOrder(payload).pipe(
          mergeMap((masterOrders: MasterOrderResourceDto) => [
            actions.createMasterOrderSuccess({ payload: masterOrders }),
          ]),
          catchError((errors) =>
            of(
              actions.createMasterOrderFailure({
                error: errors,
              }),
            ),
          ),
        ),
      ),
    );
  },
  { functional: true, dispatch: true },
);
