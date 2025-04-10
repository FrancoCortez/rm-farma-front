import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export class State {
  loading!: boolean;
  isLoader!: boolean;
  schemaCombo: ComboModelDto[] = [];
  error?: ErrorModelDto;
}

export const initialState: State = {
  loading: false,
  isLoader: false,
  schemaCombo: [],
  error: undefined,
};
