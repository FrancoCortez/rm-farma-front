import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import * as actions from './actions';
import { catchError, exhaustMap, map, mergeMap, of } from 'rxjs';
import { OrderDetailsService } from '../../services/order-details.service';
import { OrderDetailsReportResourceDto } from '../../model/master-order-details/order-details-report.resource.dto';
import { MasterOrderService } from '../../services/master-order.service';
import { MasterOrderFormResourceDto } from '../../model/master-order/master-order-form-resource.dto';
import { MasterOrderResourceDto } from '../../model/master-order/master-order-resource.dto';
import { MasterOrderDetailsUpdateFormResourceDto } from '../../model/master-order-details/master-order-details-update-form-resource.dto';
import { OrderDetailsResumeReportResourceDto } from '../../model/master-order-details/order-details-resume-report.resource.dto';

export const findOrderDetailReport = createEffect(
  (
    actions$ = inject(Actions),
    orderDetailsService = inject(OrderDetailsService),
  ) => {
    return actions$.pipe(
      ofType(actions.findCustomReport),
      exhaustMap((payload) =>
        orderDetailsService
          .customReport(payload.payload.startDate, payload.payload.endDate)
          .pipe(
            map((orderDetails: OrderDetailsReportResourceDto[]) => {
              const formattedOrderDetails = orderDetails.map(
                (
                  detail: OrderDetailsReportResourceDto,
                ): OrderDetailsReportResourceDto => ({
                  ...detail,
                  productionDate: detail.productionDate
                    ? formatDate(detail.productionDate as Date)
                    : undefined,
                }),
              );
              return actions.findCustomReportSuccess({
                payload: formattedOrderDetails,
              });
            }),
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

export const findOrderDetailResumeReport = createEffect(
  (
    actions$ = inject(Actions),
    orderDetailsService = inject(OrderDetailsService),
  ) => {
    return actions$.pipe(
      ofType(actions.findResumeReport),
      exhaustMap((payload) =>
        orderDetailsService
          .customResumeReport(
            payload.payload.startDate,
            payload.payload.endDate,
          )
          .pipe(
            map((orderDetails: OrderDetailsResumeReportResourceDto[]) => {
              const formattedOrderDetails = orderDetails.map(
                (
                  detail: OrderDetailsResumeReportResourceDto,
                ): OrderDetailsResumeReportResourceDto => ({
                  ...detail,
                  productionDate: detail.productionDate
                    ? formatDate(detail.productionDate as Date)
                    : undefined,
                }),
              );
              return actions.findResumeReportSuccess({
                payload: formattedOrderDetails,
              });
            }),
            catchError((errors) =>
              of(
                actions.findResumeReportFailure({
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

export const createOrderDetail = createEffect(
  (actions$ = inject(Actions), service = inject(OrderDetailsService)) => {
    return actions$.pipe(
      ofType(actions.updatedDetailsProduction),
      exhaustMap(
        ({ payload }: { payload: MasterOrderDetailsUpdateFormResourceDto }) =>
          service.updateDetail(payload).pipe(
            mergeMap((masterOrders: MasterOrderResourceDto) => [
              actions.updatedDetailsProductionSuccess(),
            ]),
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
  { functional: true, dispatch: true },
);

function formatDate(date: Date) {
  // const date = new Date(inDate.getTime());
  const inDate = new Date(date);
  const day = String(inDate.getDate()).padStart(2, '0');
  const month = String(inDate.getMonth() + 1).padStart(2, '0');
  const year = String(inDate.getFullYear()).slice(-4);
  const hours = String(inDate.getHours()).padStart(2, '0');
  const minutes = String(inDate.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
