import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  ClinicStoreActions,
  ClinicStoreModule,
  ClinicStoreSelectors,
  DiagnosisStoreModule,
  IsapreStoreModule,
  PatientStoreModule,
  PatientStoreSelectors,
  RootStoreState,
  SchemaStoreActions,
  SchemaStoreModule,
  SchemaStoreSelectors,
} from '../../../../../root-store';
import { ComboModelDto } from '../../../../../utils/models/combo-model.dto';
import { filter, Subscription } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { FormControlStatusDirective } from '../../../../../utils/directives/form-control-status.directive';
import { FormValidationMessagesComponent } from '../../../../../utils/components/form-validation-messages/form-validation-messages.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import {
  ServiceStoreActions,
  ServiceStoreModule,
  ServiceStoreSelectors,
} from '../../../../../root-store/service-store';
import {
  HospitalUnitStoreActions,
  HospitalUnitStoreModule,
  HospitalUnitStoreSelectors,
} from '../../../../../root-store/hospital-unit-store';
import {
  PatientFormStoreActions,
  PatientFormStoreModule,
  PatientFormStoreSelectors,
} from '../../../../../root-store/patient-form-store';
import { DiagnosisPatientResourceDto } from '../../../../../model/diagnosis-patient/diagnosis-patient-resource.dto';

@Component({
  selector: 'app-other-information-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    FormControlStatusDirective,
    FormValidationMessagesComponent,
    ButtonDirective,
    Ripple,
    ClinicStoreModule,
    IsapreStoreModule,
    DiagnosisStoreModule,
    SchemaStoreModule,
    PatientStoreModule,
    ServiceStoreModule,
    HospitalUnitStoreModule,
    IsapreStoreModule,
    PatientFormStoreModule,
  ],
  templateUrl: './other-information-form.component.html',
})
export class OtherInformationFormComponent implements OnInit, OnDestroy {
  @Input() nextCallbacks: any;
  @Input() previousCallbacks: any;
  @Output() sendValueForm = new EventEmitter<FormGroup>();
  @Input() preLoadDiagnosisPatient?: DiagnosisPatientResourceDto = {};
  otherInformationForm!: FormGroup;

  clinicsCombo: ComboModelDto[] = [];
  schemaCombo: ComboModelDto[] = [];
  serviceCombo: ComboModelDto[] = [];
  hospitalUnitCombo: ComboModelDto[] = [];

  clinicsComboSubscription$: Subscription = new Subscription();
  schemaComboSubscription$: Subscription = new Subscription();
  serviceComboSubscription$: Subscription = new Subscription();
  hospitalUnitComboSubscription$: Subscription = new Subscription();

  loadPatient$: Subscription = new Subscription();
  statePatientFormValue$: Subscription = new Subscription();

  statePatientFormValue!: {
    patientFormValid: boolean;
    diagnosticFormValid: boolean;
    cyclesFormValid: boolean;
    otherInformationFormValid: boolean;
    doctorFormValid: boolean;
  };

  constructor(
    private fb: FormBuilder,
    private readonly store: Store<RootStoreState.RootState>,
  ) {}

  readStateFormPatient() {
    this.statePatientFormValue$ = this.store
      .select(PatientFormStoreSelectors.allStateValidForm)
      .subscribe({
        next: (value) => {
          this.statePatientFormValue = value;
        },
      });
  }

  ngOnInit(): void {
    this.initCombos();
    this.readStateFormPatient();
    this.otherInformationForm = this.fb.group({
      clinic: ['', Validators.required],
      schema: ['', Validators.required],
      services: [''],
      hospitalUnit: [''],
    });
    if (this.preLoadDiagnosisPatient) {
      this.otherInformationForm.patchValue(this.preLoadDiagnosisPatient);
    }
  }

  ngOnDestroy() {
    this.clinicsComboSubscription$.unsubscribe();
    this.schemaComboSubscription$.unsubscribe();
    this.serviceComboSubscription$.unsubscribe();
    this.hospitalUnitComboSubscription$.unsubscribe();
    this.loadPatient$.unsubscribe();
  }

  submitEmit() {
    if (this.otherInformationForm.valid) {
      this.nextCallbacks.emit();
      this.emitFormValues();
      this.store.dispatch(
        PatientFormStoreActions.pushValidStateForm({
          payload: {
            ...this.statePatientFormValue,
            otherInformationFormValid: true,
          },
        }),
      );
    }
  }

  previousCallback(): void {
    this.previousCallbacks.emit();
  }

  emitFormValues(): void {
    this.sendValueForm.emit(this.otherInformationForm);
  }

  resetForm(): void {
    this.otherInformationForm.reset();
  }

  private initCombos(): void {
    this.readClinicCombo();
    this.readSchemaCombo();
    this.readServiceCombo();
    this.readHospitalUnitCombo();
  }

  private readHospitalUnitCombo() {
    this.store.dispatch(HospitalUnitStoreActions.loadHospitalUnits());
    this.hospitalUnitComboSubscription$ = this.store
      .select(HospitalUnitStoreSelectors.selectComboHospitalUnit)
      .pipe(filter((f) => !!f && f.length > 0))
      .subscribe({
        next: (data: ComboModelDto[] | []) => (this.hospitalUnitCombo = data),
      });
  }

  private readServiceCombo() {
    this.store.dispatch(ServiceStoreActions.loadService());
    this.serviceComboSubscription$ = this.store
      .select(ServiceStoreSelectors.selectorServiceCombo)
      .pipe(filter((f) => !!f && f.length > 0))
      .subscribe({
        next: (service) => (this.serviceCombo = service),
      });
  }

  private readClinicCombo() {
    this.store.dispatch(ClinicStoreActions.loadClinic());
    this.clinicsComboSubscription$ = this.store
      .select(ClinicStoreSelectors.selectComboClinic)
      .pipe(filter((f) => !!f && f.length > 0))
      .subscribe({
        next: (data: ComboModelDto[] | []) => (this.clinicsCombo = data),
      });
  }

  private readSchemaCombo() {
    this.store.dispatch(SchemaStoreActions.loadSchema());
    this.schemaComboSubscription$ = this.store
      .select(SchemaStoreSelectors.selectComboSchema)
      .pipe(filter((f) => !!f))
      .subscribe({
        next: (data: ComboModelDto[] | []) => (this.schemaCombo = data),
      });
  }
}
