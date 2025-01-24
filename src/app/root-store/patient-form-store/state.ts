import { PatientFormResourceDto } from '../../model/patient/patient-form-resource.dto';

export class State {
  patientFormValid: boolean = false;
  diagnosticFormValid: boolean = false;
  cyclesFormValid: boolean = false;
  otherInformationFormValid: boolean = false;
  doctorFormValid: boolean = false;
  diagnosticCount: number = 0;
  patientFormCreate: PatientFormResourceDto = {};
}

export const initialState: State = {
  patientFormValid: false,
  diagnosticFormValid: false,
  cyclesFormValid: false,
  otherInformationFormValid: false,
  doctorFormValid: false,
  diagnosticCount: 0,
  patientFormCreate: {},
};
