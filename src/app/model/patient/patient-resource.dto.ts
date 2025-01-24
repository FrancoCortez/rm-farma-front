import { IsapreResourceDto } from '../isapre/isapre-resource.dto';
import { DiagnosisPatientResourceDto } from '../diagnosis-patient/diagnosis-patient-resource.dto';

export class PatientResourceDto {
  id?: string;
  identification?: string;
  rut?: string;
  type?: string;
  name?: string;
  lastName?: string;
  isapre?: IsapreResourceDto;
  diagnosisPatient?: Array<DiagnosisPatientResourceDto> = [];
}
