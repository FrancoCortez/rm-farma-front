import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { ComplementResourceDto } from '../../model/complement/complement-resource.dto';

export class State {
  loading!: boolean;
  isLoader!: boolean;
  error?: ErrorModelDto;
  complements: ComplementResourceDto[] = [];
}

export const initialState: State = {
  loading: false,
  isLoader: false,
  error: undefined,
  complements: [],
};
