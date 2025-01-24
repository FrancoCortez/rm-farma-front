import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { ProductResourceDto } from '../../model/product/product-resource.dto';

export class State {
  loading!: boolean;
  isLoader!: boolean;
  error?: ErrorModelDto;
  products: ProductResourceDto[] = [];
}

export const initialState: State = {
  loading: false,
  isLoader: false,
  error: undefined,
  products: [],
};
