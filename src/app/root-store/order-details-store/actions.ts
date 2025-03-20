import { createAction, props } from '@ngrx/store';
import { OrderDetailsReportResourceDto } from '../../model/master-order-details/order-details-report.resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { MasterOrderDetailsUpdateFormResourceDto } from '../../model/master-order-details/master-order-details-update-form-resource.dto';
import { OrderDetailsResumeReportResourceDto } from '../../model/master-order-details/order-details-resume-report.resource.dto';

export const findCustomReport = createAction(
  '[OrderDetails] Find Custom Report',
  props<{ payload: { startDate: Date; endDate: Date } }>(),
);
export const findCustomReportSuccess = createAction(
  '[OrderDetails] Find Custom Report Success',
  props<{ payload: OrderDetailsReportResourceDto[] }>(),
);

export const findCustomReportFailure = createAction(
  '[OrderDetails] Find Custom Report Failure',
  props<{ error: ErrorModelDto }>(),
);

export const updatedDetailsProduction = createAction(
  '[OrderDetails] Updated Details Production',
  props<{ payload: MasterOrderDetailsUpdateFormResourceDto }>(),
);

export const updatedDetailsProductionSuccess = createAction(
  '[OrderDetails] Updated Details Production Success',
);
export const updatedDetailsProductionFailure = createAction(
  '[OrderDetails] Updated Details Production Failure',
  props<{ error: ErrorModelDto }>(),
);

export const findResumeReport = createAction(
  '[OrderDetails] Find Resume Report',
  props<{ payload: { startDate: Date; endDate: Date } }>(),
);

export const findResumeReportSuccess = createAction(
  '[OrderDetails] Find Resume Report Success',
  props<{ payload: OrderDetailsResumeReportResourceDto[] }>(),
);

export const findResumeReportFailure = createAction(
  '[OrderDetails] Find Resume Report Failure',
  props<{ error: ErrorModelDto }>(),
);

export const resetStore = createAction('[OrderDetails] Reset Store');
