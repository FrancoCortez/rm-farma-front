import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';
import { OtherInformationFormComponent } from './other-information-form/other-information-form.component';
import { CyclesFormComponent } from './cycles-form/cycles-form.component';
import { StepperModule } from 'primeng/stepper';
import { DiagnosisComponent } from './diagnosis/diagnosis.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DiagnosisPatientFormResourceDto } from '../../../../model/diagnosis-patient/diagnosis-patient-form-resource.dto';
import {
  PatientFormStoreActions,
  PatientFormStoreModule,
} from '../../../../root-store/patient-form-store';
import { Store } from '@ngrx/store';
import { RootStoreState } from '../../../../root-store';
import { DiagnosisPatientResourceDto } from '../../../../model/diagnosis-patient/diagnosis-patient-resource.dto';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-diagnosis-patient-form',
  standalone: true,
  imports: [
    FieldsetModule,
    DoctorFormComponent,
    OtherInformationFormComponent,
    CyclesFormComponent,
    StepperModule,
    DiagnosisComponent,
    PatientFormStoreModule,
    DialogModule,
    CalendarModule,
    PaginatorModule,
    ReactiveFormsModule,
  ],
  templateUrl: './diagnosis-patient-form.component.html',
})
export class DiagnosisPatientFormComponent implements OnInit, OnDestroy {
  forceValue!: number;
  @Input() preLoadDataPatient?: DiagnosisPatientResourceDto;
  dataAllForm: DiagnosisPatientFormResourceDto = {};
  @Output() sendAllData: EventEmitter<DiagnosisPatientFormResourceDto[]> =
    new EventEmitter();

  @ViewChild(DiagnosisComponent) diagnosisComponent!: DiagnosisComponent;
  @ViewChild(DoctorFormComponent) doctorFormComponent!: DoctorFormComponent;
  @ViewChild(CyclesFormComponent) cyclesFormComponent!: CyclesFormComponent;
  @ViewChild(OtherInformationFormComponent)
  otherInformationFormComponent!: OtherInformationFormComponent;

  isCollapse = true;
  nameDiagnosisHeader = 'Nuevo Diagnóstico';

  checkPatientDiagnosis!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly store: Store<RootStoreState.RootState>,
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.initFormCheckPatientDiagnosis();
    this.nameDiagnosisHeader =
      this.preLoadDataPatient?.diagnosis?.description || 'Nuevo Diagnóstico';
    this.forceValue = 0;
  }

  initFormCheckPatientDiagnosis() {
    this.checkPatientDiagnosis = this.fb.group({
      productionDate: [new Date(), Validators.required],
    });
  }

  addDiagnosticForm(form: FormGroup) {
    if (form.valid) {
      const diagnosisFormValue = {
        diagnosis: form.value.diagnosis.code,
      };
      this.dataAllForm = {
        ...this.dataAllForm,
        ...diagnosisFormValue,
      };
      this.nameDiagnosisHeader =
        form.value.diagnosis.name ||
        this.preLoadDataPatient?.diagnosis?.description ||
        'Nuevo Diagnóstico';
    }
  }

  addDataCyclesForm(form: FormGroup) {
    if (form.valid) {
      this.dataAllForm = { ...this.dataAllForm, ...form.value };
    }
  }

  addDataDoctorForm(form: FormGroup) {
    if (form.valid) {
      const doctorFormValue = {
        doctor: form.value.doctor.code,
      };
      this.dataAllForm = { ...this.dataAllForm, ...doctorFormValue };
    }
  }

  addDataOtherInformationForm(form: FormGroup) {
    if (form.valid) {
      const otherInformationFormValue = {
        schema: form.value.schema.code,
        hospitalUnit: form.value.hospitalUnit.code,
        services: form.value.services.code,
      };
      this.dataAllForm = { ...this.dataAllForm, ...otherInformationFormValue };
      this.store.dispatch(
        PatientFormStoreActions.pushDiagnosisPatientForm({
          payload: this.dataAllForm,
        }),
      );
      this.isCollapse = true;
    }
  }

  resetAllForms(): void {
    this.doctorFormComponent.resetForm();
    this.cyclesFormComponent.resetForm();
    this.otherInformationFormComponent.resetForm();
    this.diagnosisComponent.resetForm();
  }
}
