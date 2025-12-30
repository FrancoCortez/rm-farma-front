export class MasterOrderDetailsUpdateFormResourceDto {
  master?: string;
  masterRecord?: string;
  details?: {
    productCode?: string;
    via?: string;
    dose?: number;
    productionDate?: Date;
    expirationDate?: Date;
    administrationDate?: Date;
    bedDay?: string;
    unitMetric?: string;
    complementCode?: string;
    volTotal?: number;
    prot?: string;
    condition?: string;
    administrationTime?: string;
    observation?: string;
    concentration?: string;
    status?: string;
    commercialPart?: Array<{
      commercial?: string;
      batch?: string;
      part?: string;
    }>;
  };
}
