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
  DiagnosisStoreActions,
  DiagnosisStoreModule,
  DiagnosisStoreSelectors,
  IsapreStoreActions,
  IsapreStoreModule,
  IsapreStoreSelectors,
  PatientStoreModule,
  PatientStoreSelectors,
  RootStoreState,
  SchemaStoreActions,
  SchemaStoreModule,
  SchemaStoreSelectors,
} from '../../../../root-store';
import { ComboModelDto } from '../../../../utils/models/combo-model.dto';
import { Subscription } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { FormControlStatusDirective } from '../../../../utils/directives/form-control-status.directive';
import { FormValidationMessagesComponent } from '../../../../utils/components/form-validation-messages/form-validation-messages.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

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
  ],
  templateUrl: './other-information-form.component.html',
})
export class OtherInformationFormComponent implements OnInit, OnDestroy {
  @Input() nextCallbacks: any;
  @Input() previousCallbacks: any;
  @Output() sendValueForm = new EventEmitter<FormGroup>();
  otherInformationForm!: FormGroup;

  clinicsCombo: ComboModelDto[] = [];
  schemaCombo: ComboModelDto[] = [];
  isapreCombo: ComboModelDto[] = [];
  diagnosisCombo: ComboModelDto[] = [];

  clinicsComboSubscription$: Subscription = new Subscription();
  schemaComboSubscription$: Subscription = new Subscription();
  isapreComboSubscription$: Subscription = new Subscription();
  diagnosisComboSubscription$: Subscription = new Subscription();
  loadPatient$: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private readonly store: Store<RootStoreState.RootState>,
  ) {}

  ngOnInit(): void {
    this.initCombos();
    this.otherInformationForm = this.fb.group({
      clinic: ['', Validators.required],
      schema: ['', Validators.required],
      isapre: ['', Validators.required],
      diagnosis: ['', Validators.required],
    });
    this.loadPatient$ = this.store
      .select(PatientStoreSelectors.selectPatient)
      .subscribe({
        next: (patient) => {
          this.otherInformationForm.patchValue(patient);
        },
      });
  }

  private initCombos(): void {
    this.readClinicCombo();
    this.readSchemaCombo();
    this.readIsapreCombo();
    this.readDiagnosisCombo();
  }

  ngOnDestroy() {
    this.clinicsComboSubscription$.unsubscribe();
    this.schemaComboSubscription$.unsubscribe();
    this.isapreComboSubscription$.unsubscribe();
    this.diagnosisComboSubscription$.unsubscribe();
    this.loadPatient$.unsubscribe();
  }

  private readDiagnosisCombo() {
    this.store.dispatch(DiagnosisStoreActions.loadDiagnosis());
    this.diagnosisComboSubscription$ = this.store
      .select(DiagnosisStoreSelectors.selectComboDiagnosis)
      .subscribe({
        next: (data: ComboModelDto[] | []) => (this.diagnosisCombo = data),
      });
  }

  private readClinicCombo() {
    this.store.dispatch(ClinicStoreActions.loadClinic());
    this.clinicsComboSubscription$ = this.store
      .select(ClinicStoreSelectors.selectComboClinic)
      .subscribe({
        next: (data: ComboModelDto[] | []) => (this.clinicsCombo = data),
      });
  }

  private readSchemaCombo() {
    this.store.dispatch(SchemaStoreActions.loadSchema());
    this.schemaComboSubscription$ = this.store
      .select(SchemaStoreSelectors.selectComboSchema)
      .subscribe({
        next: (data: ComboModelDto[] | []) => (this.schemaCombo = data),
      });
  }

  private readIsapreCombo() {
    this.store.dispatch(IsapreStoreActions.loadIsapre());
    this.isapreComboSubscription$ = this.store
      .select(IsapreStoreSelectors.selectComboIsapre)
      .subscribe({
        next: (data: ComboModelDto[] | []) => (this.isapreCombo = data),
      });
  }

  submitEmit() {
    this.emitFormValues();
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
}
