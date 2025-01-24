import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { MasterOrderResourceDto } from '../../model/master-order/master-order-resource.dto';

export class State {
  loading!: boolean;
  isLoader!: boolean;
  error?: ErrorModelDto;
  successCreateOrUpdate: boolean = false;
  masterOrders: MasterOrderResourceDto[] = [];
}

export const initialState: State = {
  loading: false,
  successCreateOrUpdate: false,
  isLoader: false,
  error: undefined,
  masterOrders: [],
};
