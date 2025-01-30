import { OrderDetailsReportResourceDto } from '../../model/master-order-details/order-details-report.resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export class State {
  loadingReport!: boolean;
  dataReport!: OrderDetailsReportResourceDto[];
  error?: ErrorModelDto;
}

export const initialState: State = {
  loadingReport: false,
  dataReport: [],
  error: undefined,
};
