import { DiagnosisPatientFormResourceDto } from '../diagnosis-patient/diagnosis-patient-form-resource.dto';

export class PatientFormResourceDto {
  rut?: string;
  type?: string;
  identification?: string;
  name?: string;
  lastName?: string;
  isapre?: string;
  diagnosisPatient?: Array<DiagnosisPatientFormResourceDto>;
}
