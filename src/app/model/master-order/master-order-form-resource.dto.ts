import { MasterOrderDetailsFormResourceDto } from '../master-order-details/master-order-details-form-resource.dto';

export class MasterOrderFormResourceDto {
  patientIdentification?: string;
  via?: string;
  productionDate?: Date;
  expirationDate?: Date;
  diagnosisOrder?: string;
  master?: string;
  details?: MasterOrderDetailsFormResourceDto;
}
