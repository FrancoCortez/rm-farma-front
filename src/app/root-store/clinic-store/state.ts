import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { ComboModelDto } from '../../utils/models/combo-model.dto';

export class State {
  loading!: boolean;
  isLoader!: boolean;
  clinicCombo: ComboModelDto[] = [];
  error?: ErrorModelDto;
}

export const initialState: State = {
  loading: false,
  isLoader: false,
  clinicCombo: [],
  error: undefined,
};
