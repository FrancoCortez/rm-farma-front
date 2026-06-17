export class ReportRecipeBookDto {
  masterRecord?: string;
  productionDate?: Date | string;
  patientName?: string;
  patientRut?: string;
  doctorName?: string;
  doctorRut?: string;
  productName?: string;
  dose?: string;
  laboratory?: string;
  lote?: string;
  expirationDate?: Date | string;
  complementName?: string;
  volumeTotal?: string;
}
