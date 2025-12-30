export class MasterOrderDetailsFormResourceDto {
  productCode?: string;
  dose?: number;
  unitMetric?: string;
  complementCode?: string;
  volTotal?: number;
  administrationDate?: Date;
  bedDay?: string;
  prot?: string;
  condition?: string;
  administrationTime?: string;
  observation?: string;
  productionDate?: Date;
  expirationDate?: Date;
  status?: string;
  concentration?: string;
  commercialPart?: Array<{
    commercial?: string;
    part?: number;
    batch?: string;
  }>;
}
