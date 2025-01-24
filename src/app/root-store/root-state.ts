import { ClinicStoreState } from './clinic-store';
import { IsapreStoreState } from './isapre-store';
import { DiagnosisStoreState } from './diagnosis-store';
import { SchemaStoreState } from './schema-store';
import { PatientStoreState } from './patient-store';
import { DoctorStoreState } from './doctor-store';
import { HospitalUnitStoreState } from './hospital-unit-store';
import { ServiceStoreState } from './service-store';
import { MasterOrderStoreState } from './master-order-store';
import { ProductStoreState } from './product-store';
import { ComplementStoreState } from './complement-store';
import { ViaStoreState } from './via-store';
import { LocalStorageStoreState } from './local-storage-store';
import { PatientFormStoreState } from './patient-form-store';
import { DiagnosisOrderStoreState } from './diagnosis-order-store';
import { CommercialProductStoreState } from './commercial-product-store';

export interface RootState {
  clinic: ClinicStoreState.State;
  isapre: IsapreStoreState.State;
  diagnosis: DiagnosisStoreState.State;
  via: ViaStoreState.State;
  schema: SchemaStoreState.State;
  patient: PatientStoreState.State;
  patientForm: PatientFormStoreState.State;
  doctor: DoctorStoreState.State;
  hospitalUnit: HospitalUnitStoreState.State;
  service: ServiceStoreState.State;
  masterOrder: MasterOrderStoreState.State;
  product: ProductStoreState.State;
  complement: ComplementStoreState.State;
  localStorage: LocalStorageStoreState.State;
  diagnosisOrder: DiagnosisOrderStoreState.State;
  commercialProduct: CommercialProductStoreState.State;
}
