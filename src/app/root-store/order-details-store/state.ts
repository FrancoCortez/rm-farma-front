import { OrderDetailsReportResourceDto } from '../../model/master-order-details/order-details-report.resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { OrderDetailsResumeReportResourceDto } from '../../model/master-order-details/order-details-resume-report.resource.dto';

export class State {
  loadingReport!: boolean;
  loadingResumeReport!: boolean;
  loadingUpdate!: boolean;
  updatedSuccessModel!: boolean;
  dataReport!: OrderDetailsReportResourceDto[];
  dataResumeReport!: OrderDetailsResumeReportResourceDto[];
  error?: ErrorModelDto;
}

export const initialState: State = {
  loadingReport: false,
  loadingResumeReport: false,
  loadingUpdate: false,
  updatedSuccessModel: false,
  dataReport: [],
  dataResumeReport: [],
  error: undefined,
};
