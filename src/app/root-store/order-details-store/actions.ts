import { createAction, props } from '@ngrx/store';
import { OrderDetailsReportResourceDto } from '../../model/master-order-details/order-details-report.resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export const findCustomReport = createAction(
  '[OrderDetails] Find Custom Report',
);
export const findCustomReportSuccess = createAction(
  '[OrderDetails] Find Custom Report Success',
  props<{ payload: OrderDetailsReportResourceDto[] }>(),
);

export const findCustomReportFailure = createAction(
  '[OrderDetails] Find Custom Report Failure',
  props<{ error: ErrorModelDto }>(),
);
