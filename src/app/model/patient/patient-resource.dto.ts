import { DoctorResourceDto } from '../doctor/doctor-resource.dto';
import { DiagnosisResourceDto } from '../diagnosis/diagnosis-resource.dto';
import { ClinicResourceDto } from '../clinic/clinic-resource.dto';
import { IsapreResourceDto } from '../isapre/isapre-resource.dto';
import { SchemaResourceDto } from '../schema/schema-resource.dto';

export class PatientResourceDto {
  id?: string;
  identification?: string;
  rut?: string;
  name?: string;
  lastName?: string;
  villa?: string;
  street?: string;
  houseNumber?: number;
  dateOfBirth?: Date;
  phone?: string;
  email?: string;
  cycleNumber?: number;
  cycleDay?: number;
  //city?: CityResourceDto;
  doctor?: DoctorResourceDto;
  // services?: ServicesResourceDto[];
  diagnosis?: DiagnosisResourceDto;
  clinic?: ClinicResourceDto;
  isapre?: IsapreResourceDto;
  schema?: SchemaResourceDto;
}
