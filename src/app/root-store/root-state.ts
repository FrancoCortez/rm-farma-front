import { ClinicStoreState } from './clinic-store';
import { IsapreStoreState } from './isapre-store';
import { DiagnosisStoreState } from './diagnosis-store';
import { SchemaStoreState } from './schema-store';
import { PatientStoreState } from './patient-store';
import { DoctorStoreState } from './doctor-store';

export interface RootState {
  clinic: ClinicStoreState.State;
  isapre: IsapreStoreState.State;
  diagnosis: DiagnosisStoreState.State;
  schema: SchemaStoreState.State;
  patient: PatientStoreState.State;
  doctor: DoctorStoreState.State;
}
