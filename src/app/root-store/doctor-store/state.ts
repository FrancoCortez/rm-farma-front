import { DoctorResourceDto } from '../../model/doctor/doctor-resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export class State {
  loading!: boolean;
  isLoader!: boolean;
  doctorResource: DoctorResourceDto = {};
  error?: ErrorModelDto;
}

export const initialState: State = {
  loading: false,
  isLoader: false,
  doctorResource: {},
  error: undefined,
};
