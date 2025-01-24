import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { PatientResourceDto } from '../../model/patient/patient-resource.dto';

export class State {
  loading!: boolean;
  isLoader!: boolean;
  error?: ErrorModelDto;
  errorForProduction?: ErrorModelDto;
  patient: PatientResourceDto = {};
  patients: PatientResourceDto[] = [];
  successCreateOrUpdate?: boolean;
}

export const initialState: State = {
  loading: false,
  isLoader: false,
  error: undefined,
  successCreateOrUpdate: false,
  errorForProduction: undefined,
  patients: [],
  patient: {},
};
