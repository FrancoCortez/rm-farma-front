import { DoctorResourceDto } from '../doctor/doctor-resource.dto';
import { ServiceResourceDto } from '../services/service-resource.dto';
import { DiagnosisResourceDto } from '../diagnosis/diagnosis-resource.dto';
import { ClinicResourceDto } from '../clinic/clinic-resource.dto';
import { SchemaResourceDto } from '../schema/schema-resource.dto';
import { HospitalUnitResourceDto } from '../hospital-unit/hospital-unit-resource.dto';

export class DiagnosisPatientResourceDto {
  id?: string;
  identificationPatient?: string;
  cycleNumber?: number;
  cycleDay?: number;
  doctor?: DoctorResourceDto;
  services?: ServiceResourceDto;
  diagnosis?: DiagnosisResourceDto;
  clinic?: ClinicResourceDto;
  schema?: SchemaResourceDto;
  hospitalUnit?: HospitalUnitResourceDto;
}
