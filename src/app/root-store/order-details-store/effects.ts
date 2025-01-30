import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { OrderDetailsService } from '../../services/order-details.service';
import { OrderDetailsReportResourceDto } from '../../model/master-order-details/order-details-report.resource.dto';

export const findOrderDetailReport = createEffect(
  (
    actions$ = inject(Actions),
    orderDetailsService = inject(OrderDetailsService),
  ) => {
    return actions$.pipe(
      ofType(actions.findCustomReport),
      exhaustMap(() =>
        orderDetailsService.customReport().pipe(
          map((orderDetails: OrderDetailsReportResourceDto[]) =>
            actions.findCustomReportSuccess({ payload: orderDetails }),
          ),
          catchError((errors) =>
            of(
              actions.findCustomReportFailure({
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
