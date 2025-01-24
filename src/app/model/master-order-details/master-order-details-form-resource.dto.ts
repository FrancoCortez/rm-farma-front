export class MasterOrderDetailsFormResourceDto {
  productCode?: string;
  dose?: number;
  unitMetric?: string;
  complementCode?: string;
  volTotal?: number;
  prot?: string;
  condition?: string;
  administrationTime?: string;
  observation?: string;
  productionDate?: Date;
  expirationDate?: Date;
  commercialPart?: Array<{
    commercial?: string;
    part?: number;
    batch?: string;
  }>;
}
