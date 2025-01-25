import { PatientResourceDto } from '../patient/patient-resource.dto';
import { ViaResourceDto } from '../via/via-resource.dto';
import { DocumentTypeResourceDto } from '../document-type/document-type-resource.dto';

export class MasterOrderResourceDto {
  id?: string;
  masterRecord?: string;
  productionDate?: Date;
  patientName?: string;
  patientLastName?: string;
  patientRut?: string;
  patientIdentification?: string;
  doctorName?: string;
  doctorRut?: string;
  unitHospitalCode?: string;
  unitHospitalName?: string;
  isapreCode?: number;
  isapreName?: string;
  diagnosisCode?: string;
  diagnosisName?: string;
  cycleNumber?: number;
  cycleDay?: string;
  schemaCode?: string;
  schemaName?: string;
  volume?: number;
  viaCode?: string;
  viaDescription?: string;
  pharmaceuticalChemist?: string;
  documentTypeCode?: string;
  documentTypeName?: string;
  patient?: PatientResourceDto;
  via?: ViaResourceDto;
  documentType?: DocumentTypeResourceDto;
}
