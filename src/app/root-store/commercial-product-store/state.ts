import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { CommercialProductResourceDto } from '../../model/commercial-product/commercial-product-resource.dto';

export class State {
  loading!: boolean;
  isLoader!: boolean;
  error?: ErrorModelDto;
  commercialProducts: CommercialProductResourceDto[] = [];
}

export const initialState: State = {
  loading: false,
  isLoader: false,
  error: undefined,
  commercialProducts: [],
};
