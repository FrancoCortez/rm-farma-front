import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { ComboModelDto } from '../../utils/models/combo-model.dto';

export class State {
  loading!: boolean;
  isLoader!: boolean;
  error?: ErrorModelDto;
  viaCombo: ComboModelDto[] = [];
}

export const initialState: State = {
  loading: false,
  isLoader: false,
  viaCombo: [],
  error: undefined,
};
