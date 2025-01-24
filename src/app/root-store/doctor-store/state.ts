import { DoctorResourceDto } from '../../model/doctor/doctor-resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';

export class State {
  loading!: boolean;
  isLoader!: boolean;
  successLoadAllDoctors!: boolean;
  doctorResource: DoctorResourceDto = {};
  doctorResources: DoctorResourceDto[] = [];
  createDoctorResource: DoctorResourceDto = {};
  error?: ErrorModelDto;
}

export const initialState: State = {
  loading: false,
  isLoader: false,
  successLoadAllDoctors: false,
  doctorResource: {},
  doctorResources: [],
  createDoctorResource: {},
  error: undefined,
};
