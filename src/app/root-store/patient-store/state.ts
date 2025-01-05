import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { PatientResourceDto } from '../../model/patient/patient-resource.dto';

export class State {
  loading!: boolean;
  isLoader!: boolean;
  error?: ErrorModelDto;
  patient: PatientResourceDto = {};
}

export const initialState: State = {
  loading: false,
  isLoader: false,
  error: undefined,
  patient: {},
};
