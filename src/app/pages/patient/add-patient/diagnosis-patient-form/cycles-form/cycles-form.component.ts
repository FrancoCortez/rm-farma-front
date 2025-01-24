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
import { filter, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  PatientStoreSelectors,
  RootStoreState,
} from '../../../../../root-store';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormControlStatusDirective } from '../../../../../utils/directives/form-control-status.directive';
import { FormValidationMessagesComponent } from '../../../../../utils/components/form-validation-messages/form-validation-messages.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import {
  PatientFormStoreActions,
  PatientFormStoreModule,
  PatientFormStoreSelectors,
} from '../../../../../root-store/patient-form-store';
import { DiagnosisPatientResourceDto } from '../../../../../model/diagnosis-patient/diagnosis-patient-resource.dto';

@Component({
  selector: 'app-cycles-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    FormControlStatusDirective,
    FormValidationMessagesComponent,
    ButtonDirective,
    Ripple,
    PatientFormStoreModule,
  ],
  templateUrl: './cycles-form.component.html',
})
export class CyclesFormComponent implements OnInit, OnDestroy {
  @Input() nextCallbacks: any;
  @Input() previousCallbacks: any;
  @Output() sendValueForm = new EventEmitter<FormGroup>();
  cycleForm!: FormGroup;
  @Input() preLoadDiagnosisPatient?: DiagnosisPatientResourceDto = {};

  statePatientFormValue!: {
    patientFormValid: boolean;
    diagnosticFormValid: boolean;
    cyclesFormValid: boolean;
    otherInformationFormValid: boolean;
    doctorFormValid: boolean;
  };

  loadPatient$: Subscription = new Subscription();
  statePatientFormValue$: Subscription = new Subscription();

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
    this.readStateFormPatient();
    this.cycleForm = this.fb.group({
      cycleNumber: [null, Validators.required],
      cycleDay: [null, Validators.required],
    });
    if (this.preLoadDiagnosisPatient) {
      this.cycleForm.patchValue(this.preLoadDiagnosisPatient);
    }
  }

  nextCallback(): void {
    if (this.cycleForm.valid) {
      this.emitFormValues();
      this.nextCallbacks.emit();
      this.store.dispatch(
        PatientFormStoreActions.pushValidStateForm({
          payload: { ...this.statePatientFormValue, cyclesFormValid: true },
        }),
      );
    }
  }

  previousCallback(): void {
    this.previousCallbacks.emit();
  }

  emitFormValues(): void {
    this.sendValueForm.emit(this.cycleForm);
  }

  resetForm(): void {
    this.cycleForm.reset();
  }

  ngOnDestroy(): void {
    this.loadPatient$.unsubscribe();
  }
}
