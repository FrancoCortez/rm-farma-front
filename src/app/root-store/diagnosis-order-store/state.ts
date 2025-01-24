import { ErrorModelDto } from '../../utils/models/error-model.dto';

export class State {
  loading!: boolean;
  isLoader!: boolean;
  error?: ErrorModelDto;
  createSuccess!: boolean;
}

export const initialState: State = {
  loading: false,
  isLoader: false,
  error: undefined,
  createSuccess: false,
};
