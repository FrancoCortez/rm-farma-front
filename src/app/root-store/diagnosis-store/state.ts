import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export class State {
  loading!: boolean;
  isLoader!: boolean;
  diagnosisCombo: ComboModelDto[] = [];
  error?: ErrorModelDto;
}

export const initialState: State = {
  loading: false,
  isLoader: false,
  diagnosisCombo: [],
  error: undefined,
};
