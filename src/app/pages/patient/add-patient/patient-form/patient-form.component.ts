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
import { rutValidator } from '../../../../utils/form-validation/rut-validator.form';
import { FormControlStatusDirective } from '../../../../utils/directives/form-control-status.directive';
import { InputTextModule } from 'primeng/inputtext';
import { RutFormatterDirective } from '../../../../utils/directives/rut-formatter.directive';
import { FormValidationMessagesComponent } from '../../../../utils/components/form-validation-messages/form-validation-messages.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { Store } from '@ngrx/store';
import {
  PatientStoreActions,
  PatientStoreSelectors,
  RootStoreState,
} from '../../../../root-store';
import { filter, Subscription } from 'rxjs';
import { PatientResourceDto } from '../../../../model/patient/patient-resource.dto';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    FormControlStatusDirective,
    InputTextModule,
    ReactiveFormsModule,
    RutFormatterDirective,
    FormValidationMessagesComponent,
    ButtonDirective,
    Ripple,
    InputNumberModule,
    CalendarModule,
    InputMaskModule,
  ],
  templateUrl: './patient-form.component.html',
})
export class PatientFormComponent implements OnInit, OnDestroy {
  @Input() nextCallbacks: any;
  @Output() sendValueForm = new EventEmitter<FormGroup>();
  patientForm!: FormGroup;

  findPatientByIdentification$: Subscription = new Subscription();

  patient: PatientResourceDto = {};

  constructor(
    private fb: FormBuilder,
    private readonly store: Store<RootStoreState.RootState>,
  ) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      rut: ['', [Validators.required, rutValidator()]],
      identification: [{ value: '', disabled: true }, Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      email: [''],
      villa: [''],
      street: [''],
      houseNumber: [null],
      dateOfBirth: [null],
    });
    this.findPatientByIdentification$ = this.store
      .select(PatientStoreSelectors.selectPatient)
      .pipe(filter((patient) => !!patient))
      .subscribe({
        next: (patient) => {
          this.patient = patient;
          this.patientForm.patchValue(patient);
        },
      });
  }

  onRutBlur(): void {
    const rutControl = this.patientForm.get('rut');
    if (rutControl?.value) {
      const rawValue = rutControl.value.replace(/\./g, '').replace('-', '');
      this.patientForm.get('identification')?.setValue(rawValue);
      this.store.dispatch(
        PatientStoreActions.findByIdentificationPatient({ payload: rawValue }),
      );
    }
  }

  nextCallbackPatient(): void {
    if (this.patientForm.valid) {
      this.emitFormValues();
      console.log(this.patient);
      this.nextCallbacks.emit();
    }
  }

  emitFormValues(): void {
    this.sendValueForm.emit(this.patientForm);
  }

  resetForm(): void {
    this.patientForm.reset();
  }

  ngOnDestroy(): void {
    this.findPatientByIdentification$.unsubscribe();
  }
}
