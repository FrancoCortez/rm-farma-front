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
import { ComboModelDto } from '../../../../../utils/models/combo-model.dto';
import { filter, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  DiagnosisStoreActions,
  DiagnosisStoreModule,
  DiagnosisStoreSelectors,
  RootStoreState,
} from '../../../../../root-store';
import { DropdownModule } from 'primeng/dropdown';
import { FormValidationMessagesComponent } from '../../../../../utils/components/form-validation-messages/form-validation-messages.component';
import { FormControlStatusDirective } from '../../../../../utils/directives/form-control-status.directive';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import {
  PatientFormStoreActions,
  PatientFormStoreModule,
  PatientFormStoreSelectors,
} from '../../../../../root-store/patient-form-store';
import { DiagnosisPatientResourceDto } from '../../../../../model/diagnosis-patient/diagnosis-patient-resource.dto';

@Component({
  selector: 'app-diagnosis',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DiagnosisStoreModule,
    DropdownModule,
    FormValidationMessagesComponent,
    FormControlStatusDirective,
    ButtonDirective,
    Ripple,
    PatientFormStoreModule,
  ],
  templateUrl: './diagnosis.component.html',
})
export class DiagnosisComponent implements OnInit, OnDestroy {
  @Input() nextCallbacks: any;
  @Output() sendValueForm = new EventEmitter<FormGroup>();
  @Input() preLoadDiagnosisPatient?: DiagnosisPatientResourceDto = {};
  diagnosisForm!: FormGroup;

  diagnosisCombo: ComboModelDto[] = [];

  diagnosisComboSubscription$: Subscription = new Subscription();
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

  ngOnDestroy(): void {
    this.diagnosisComboSubscription$.unsubscribe();
  }

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
    this.readStateFormPatient();
    this.initCombos();
    this.diagnosisForm = this.fb.group({
      diagnosis: ['', Validators.required],
    });
    if (this.preLoadDiagnosisPatient) {
      this.diagnosisForm.patchValue(this.preLoadDiagnosisPatient);
    }
  }

  initCombos() {
    this.readDiagnosisCombo();
  }

  nextCallbackDiagnosis() {
    if (this.diagnosisForm.valid) {
      this.emitFormValues();
      this.nextCallbacks.emit();
      this.store.dispatch(
        PatientFormStoreActions.pushValidStateForm({
          payload: { ...this.statePatientFormValue, diagnosticFormValid: true },
        }),
      );
    }
  }

  emitFormValues(): void {
    this.sendValueForm.emit(this.diagnosisForm);
  }

  resetForm(): void {
    this.diagnosisForm.reset();
  }

  private readDiagnosisCombo() {
    this.store.dispatch(DiagnosisStoreActions.loadDiagnosis());
    this.diagnosisComboSubscription$ = this.store
      .select(DiagnosisStoreSelectors.selectComboDiagnosis)
      .pipe(filter((f) => !!f && f.length > 0))
      .subscribe({
        next: (data: ComboModelDto[] | []) => (this.diagnosisCombo = data),
      });
  }
}
