import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Store } from '@ngrx/store';
import {
  DiagnosisStoreActions,
  DiagnosisStoreModule,
  DiagnosisStoreSelectors,
  IsapreStoreActions,
  IsapreStoreModule,
  IsapreStoreSelectors,
  PatientStoreActions,
  PatientStoreModule,
  PatientStoreSelectors,
  RootStoreState,
  SchemaStoreActions,
  SchemaStoreModule,
  SchemaStoreSelectors,
} from '../../../root-store';
import { rutValidator } from '../../../utils/form-validation/rut-validator.form';
import { filter, map } from 'rxjs';
import { ComboModelDto } from '../../../utils/models/combo-model.dto';
import { FormValidationMessagesComponent } from '../../../utils/components/form-validation-messages/form-validation-messages.component';
import { InputTextModule } from 'primeng/inputtext';
import { NgForOf, NgIf } from '@angular/common';
import { RutFormatterDirective } from '../../../utils/directives/rut-formatter.directive';
import { FormControlStatusDirective } from '../../../utils/directives/form-control-status.directive';
import { DropdownModule } from 'primeng/dropdown';
import { ModalErrorComponent } from '../../../utils/components/modal-error/modal-error.component';
import { ModalSuccessComponent } from '../../../utils/components/modal-success/modal-success.component';
import { SpinnerComponent } from '../../../utils/components/spinner/spinner.component';
import {
  DoctorStoreActions,
  DoctorStoreModule,
  DoctorStoreSelectors,
} from '../../../root-store/doctor-store';
import { DoctorResourceDto } from '../../../model/doctor/doctor-resource.dto';
import {
  HospitalUnitStoreActions,
  HospitalUnitStoreModule,
  HospitalUnitStoreSelectors,
} from '../../../root-store/hospital-unit-store';
import {
  ServiceStoreActions,
  ServiceStoreModule,
  ServiceStoreSelectors,
} from '../../../root-store/service-store';
import { InputNumberModule } from 'primeng/inputnumber';
import { Button, ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { PatientFormResourceDto } from '../../../model/patient/patient-form-resource.dto';
import { PatientResourceDto } from '../../../model/patient/patient-resource.dto';
import { DiagnosisPatientResourceDto } from '../../../model/diagnosis-patient/diagnosis-patient-resource.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-add-patient-v2',
  standalone: true,
  imports: [
    FormsModule,
    RadioButtonModule,
    ReactiveFormsModule,
    FormValidationMessagesComponent,
    InputTextModule,
    NgIf,
    RutFormatterDirective,
    FormControlStatusDirective,
    DropdownModule,
    ModalErrorComponent,
    ModalSuccessComponent,
    SpinnerComponent,
    NgForOf,
    InputNumberModule,
    IsapreStoreModule,
    PatientStoreModule,
    DiagnosisStoreModule,
    DoctorStoreModule,
    SchemaStoreModule,
    HospitalUnitStoreModule,
    ServiceStoreModule,
    Button,
    ButtonDirective,
    Ripple,
  ],
  templateUrl: './add-patient-v2.component.html',
})
export class AddPatientV2Component implements OnInit, OnDestroy {
  typeIdentification: string = 'RUT';
  patientForm!: FormGroup;
  patient: PatientResourceDto = {};

  isapreCombo: ComboModelDto[] = [];
  diagnosisCombo: ComboModelDto[] = [];
  doctorCombo: ComboModelDto[] = [];
  schemaCombo: ComboModelDto[] = [];
  serviceCombo: ComboModelDto[] = [];
  hospitalUnitCombo: ComboModelDto[] = [];

  isLoading = false;
  displayError = false;
  displayOk = false;
  messageError? = '';

  constructor(
    private fb: FormBuilder,
    private readonly store: Store<RootStoreState.RootState>,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private router: Router,
    private patientService: PatientService,
  ) {}

  ngOnDestroy(): void {
    // this.store.dispatch(PatientStoreActions.resetState());
  }

  ngOnInit(): void {
    this.initCombos();
    this.initFormPatient();
    this.initialForList();
    this.dynamicValidation();
    // Subscribe to valueChanges to monitor changes in form values
    this.patientForm.valueChanges.subscribe((value) => {
      // console.log('Form value changed:', value);
    });

    // Subscribe to statusChanges to monitor changes in form validation status
    this.patientForm.statusChanges.subscribe((status) => {
      // console.log('Form status changed:', status);
    });
  }

  // isLoadingOperation() {
  //   this.store.select(PatientStoreSelectors.selectLoading).subscribe({
  //     next: (loading) => (this.isLoading = loading),
  //   });
  // }

  // isLoader() {
  //   this.store
  //     .select(PatientStoreSelectors.selectSuccessCreateOrUpdate)
  //     .subscribe({
  //       next: (value) => {
  //         this.displayOk = value || false;
  //       },
  //     });
  // }

  findPatientByIdentification(identification: string) {
    this.patientService.findByIdentificationPatent(identification).subscribe({
      next: (patient) => {
        this.isLoading = true;
        this.patient = patient;
        this.resetForm();
        this.addDiagnosisData(this.mapDiagnosisDataLoadingPatient(patient));
        this.patientForm.patchValue(this.patient);
      },
      error: (error) => {
        this.resetForm();
        this.diagnosis.push(this.createDiagnosis());
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  initialForList() {
    this.route.queryParams.subscribe((params) => {
      this.ngZone.run(() => {
        const param = params['identification'] || '0';
        if (param && param !== '0') {
          this.findPatientByIdentification(param);
          // this.cdr.detectChanges();
        }
      });
    });
  }

  initFormPatient() {
    this.patientForm = this.fb.group({
      rut: ['', [Validators.required, rutValidator()]],
      type: ['RUT', [Validators.required]],
      identification: [{ value: '', disabled: true }, Validators.required],
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      isapre: [''],
      diagnosis: this.fb.array([]),
    });
  }

  addDiagnosisData(diagnosisData: DiagnosisPatientResourceDto[] = []) {
    diagnosisData.forEach((data) => {
      this.diagnosis.push(this.createDiagnosis(data));
    });
    // if (
    //   diagnosisData.length === 0 ||
    //   this.patient.diagnosisPatient?.length === 0
    // ) {
    //   this.diagnosis.push(this.createDiagnosis());
    // }
  }

  mapDiagnosisDataLoadingPatient(patient: PatientResourceDto) {
    return patient?.diagnosisPatient?.map((part) => {
      return {
        id: part.id,
        diagnosis: this.diagnosisCombo.find(
          (d) => d.code === part.diagnosis?.code,
        ),
        cycleNumber: part.cycleNumber,
        cycleDay: part.cycleDay,
        doctor: this.doctorCombo.find((d) => d.code === part.doctor?.id),
        schema: this.schemaCombo.find((d) => d.code === part.schema?.code),
        services: this.serviceCombo.find((d) => d.code === part.services?.code),
        hospitalUnit: this.hospitalUnitCombo.find(
          (d) => d.code === part.hospitalUnit?.code,
        ),
      };
    });
  }

  createDiagnosis(data: DiagnosisPatientResourceDto = {}): FormGroup {
    return this.fb.group({
      id: [data.id || ''],
      diagnosis: [data.diagnosis || '', Validators.required],
      cycleNumber: [data.cycleNumber || '', Validators.required],
      cycleDay: [data.cycleDay || '', Validators.required],
      doctor: [data.doctor || '', Validators.required],
      schema: [data.schema || '', Validators.required],
      services: [data.services || '', Validators.required],
      hospitalUnit: [data.hospitalUnit || '', Validators.required],
    });
  }

  get diagnosis(): FormArray {
    return this.patientForm.get('diagnosis') as FormArray;
  }

  initCombos() {
    this.readIsapreCombo();
    this.readDiagnosisCombo();
    this.readDoctorCombo();
    this.readSchemaCombo();
    this.readServiceCombo();
    this.readHospitalUnitCombo();
  }

  onTypeChange($event: any) {
    this.typeIdentification = $event.value;
    this.clear();
    this.diagnosis.push(this.createDiagnosis());
  }

  dynamicValidation() {
    this.patientForm.get('type')?.valueChanges.subscribe((selectedType) => {
      const rutControl = this.patientForm.get('rut');
      if (selectedType === 'RUT') {
        rutControl?.setValidators([Validators.required, rutValidator()]);
      } else {
        rutControl?.setValidators([Validators.required]);
      }
      rutControl?.updateValueAndValidity();
    });
  }

  private readIsapreCombo() {
    this.store.dispatch(IsapreStoreActions.loadIsapre());
    this.store
      .select(IsapreStoreSelectors.selectComboIsapre)
      .pipe(filter((f) => !!f && f.length > 0))
      .subscribe({
        next: (data: ComboModelDto[] | []) => (this.isapreCombo = data),
      });
  }

  private readDiagnosisCombo() {
    this.store.dispatch(DiagnosisStoreActions.loadDiagnosis());
    this.store
      .select(DiagnosisStoreSelectors.selectComboDiagnosis)
      .pipe(filter((f) => !!f && f.length > 0))
      .subscribe({
        next: (data: ComboModelDto[] | []) => (this.diagnosisCombo = data),
      });
  }

  private readHospitalUnitCombo() {
    this.store.dispatch(HospitalUnitStoreActions.loadHospitalUnits());
    this.store
      .select(HospitalUnitStoreSelectors.selectComboHospitalUnit)
      .pipe(filter((f) => !!f && f.length > 0))
      .subscribe({
        next: (data: ComboModelDto[] | []) => (this.hospitalUnitCombo = data),
      });
  }

  private readServiceCombo() {
    this.store.dispatch(ServiceStoreActions.loadService());
    this.store
      .select(ServiceStoreSelectors.selectorServiceCombo)
      .pipe(filter((f) => !!f && f.length > 0))
      .subscribe({
        next: (service) => (this.serviceCombo = service),
      });
  }

  private readSchemaCombo() {
    this.store.dispatch(SchemaStoreActions.loadSchema());
    this.store
      .select(SchemaStoreSelectors.selectComboSchema)
      .pipe(filter((f) => !!f))
      .subscribe({
        next: (data: ComboModelDto[] | []) => (this.schemaCombo = data),
      });
  }

  private readDoctorCombo() {
    this.store.dispatch(DoctorStoreActions.loadAllDoctors());
    this.store
      .select(DoctorStoreSelectors.selectDoctorResources)
      .pipe(
        map((doctors: DoctorResourceDto[]) => {
          return doctors.map((doctor) => {
            return {
              name: doctor.name,
              code: doctor.id,
            };
          });
        }),
      )
      .subscribe({
        next: (doctor) => {
          this.doctorCombo = doctor;
        },
      });
  }

  onRutBlur(): void {
    const rutControl = this.patientForm.get('rut');
    if (rutControl?.value) {
      const rawValue = rutControl.value.replace(/\./g, '').replace('-', '');
      this.patientForm.get('identification')?.setValue(rawValue);
      this.findPatientByIdentification(rawValue);
    }
  }

  confirmDialog($event: boolean) {
    this.displayOk = $event;
    this.clear();
  }

  addDiagnosis() {
    this.diagnosis.push(this.createDiagnosis());
    this.cdr.detectChanges();
  }

  removeDiagnosis(index: number) {
    if (this.diagnosis.length > 1) {
      this.diagnosis.removeAt(index);
    }
  }

  savePatient() {
    const formValue = this.patientForm.getRawValue();
    const sendDataValue: PatientFormResourceDto = {
      rut: formValue.rut,
      type: formValue.type,
      identification: formValue.identification,
      name: formValue.name,
      lastName: formValue.lastName,
      isapre: formValue?.isapre?.code,
      diagnosisPatient: formValue.diagnosis.map((c: any) => ({
        id: c.id,
        diagnosis: c.diagnosis?.code,
        cycleNumber: c.cycleNumber,
        cycleDay: c.cycleDay,
        doctor: c.doctor?.code,
        schema: c.schema?.code,
        services: c.services?.code,
        hospitalUnit: c.hospitalUnit?.code,
      })),
    };
    this.patientService.createPatient(sendDataValue).subscribe({
      next: (patient) => {
        this.isLoading = true;
        this.displayOk = true;
        this.clear();
      },
      error: (err) => {
        this.messageError = err.error.message;
        this.displayError = true;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  resetFormExcept(fieldsToKeep: string[]) {
    const fieldValues: { [key: string]: any } = {};
    const fieldValidators: { [key: string]: any } = {};
    fieldsToKeep.forEach((field) => {
      const control = this.patientForm.get(field);
      if (control) {
        fieldValues[field] = control.value;
        fieldValidators[field] = control.validator ? [control.validator] : [];
      }
    });
    Object.keys(this.patientForm.controls).forEach((field) => {
      if (!fieldsToKeep.includes(field)) {
        this.patientForm.get(field)?.reset();
      }
    });
    fieldsToKeep.forEach((field) => {
      const control = this.patientForm.get(field);
      if (control) {
        control.setValue(fieldValues[field]);
        control.setValidators(fieldValidators[field]);
        control.updateValueAndValidity();
      }
    });
  }

  resetForm() {
    const currentType = this.patientForm.get('type')?.value;
    this.resetFormExcept(['rut', 'identification']);
    this.diagnosis.clear();
    this.diagnosis.reset();
    this.addDiagnosisData();
    this.patientForm.get('type')?.setValue(currentType);
    this.patientForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  clear() {
    const currentType = this.patientForm.get('type')?.value;
    this.patientForm.reset();
    this.diagnosis.clear();
    this.diagnosis.reset();
    this.addDiagnosisData();
    this.patientForm.get('type')?.setValue(currentType);
    this.cdr.detectChanges();
  }
}
