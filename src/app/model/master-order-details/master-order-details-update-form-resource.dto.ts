export class MasterOrderDetailsUpdateFormResourceDto {
  master?: string;
  masterRecord?: string;
  details?: {
    productCode?: string;
    via?: string;
    dose?: number;
    productionDate?: Date;
    expirationDate?: Date;
    unitMetric?: string;
    complementCode?: string;
    volTotal?: number;
    prot?: string;
    condition?: string;
    administrationTime?: string;
    observation?: string;
    commercialPart?: Array<{
      commercial?: string;
      batch?: string;
      part?: string;
    }>;
  };
}
