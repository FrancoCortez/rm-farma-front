import {
  Component,
  EventEmitter,
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
  IsapreStoreActions,
  IsapreStoreSelectors,
  PatientStoreActions,
  PatientStoreSelectors,
  RootStoreState,
} from '../../../../root-store';
import { filter, Subscription } from 'rxjs';
import { PatientResourceDto } from '../../../../model/patient/patient-resource.dto';
import {
  PatientFormStoreActions,
  PatientFormStoreModule,
  PatientFormStoreSelectors,
} from '../../../../root-store/patient-form-store';
import { DropdownModule } from 'primeng/dropdown';
import { ComboModelDto } from '../../../../utils/models/combo-model.dto';
import { PatientFormResourceDto } from '../../../../model/patient/patient-form-resource.dto';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgIf } from '@angular/common';

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
    PatientFormStoreModule,
    DropdownModule,
    RadioButtonModule,
    NgIf,
  ],
  templateUrl: './patient-form.component.html',
})
export class PatientFormComponent implements OnInit, OnDestroy {
  @Output() sendValueForm = new EventEmitter<FormGroup>();
  patientForm!: FormGroup;
  isapreCombo: ComboModelDto[] = [];

  findPatientByIdentification$: Subscription = new Subscription();
  statePatientFormValue$: Subscription = new Subscription();
  isapreComboSubscription$: Subscription = new Subscription();

  patient: PatientResourceDto = {};
  statePatientFormValue!: {
    patientFormValid: boolean;
    diagnosticFormValid: boolean;
    cyclesFormValid: boolean;
    otherInformationFormValid: boolean;
    doctorFormValid: boolean;
  };
  typeIdentification: string = 'RUT';

  constructor(
    private fb: FormBuilder,
    private readonly store: Store<RootStoreState.RootState>,
  ) {}

  initFormPatient() {
    this.patientForm = this.fb.group({
      rut: ['', [Validators.required, rutValidator()]],
      type: ['RUT', [Validators.required]],
      identification: [{ value: '', disabled: true }, Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      isapre: [''],
    });
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
  ngOnInit(): void {
    this.findValidFormPatient();
    this.initCombos();
    this.initFormPatient();
    this.findPatientByIdentification$ = this.store
      .select(PatientStoreSelectors.selectPatient)
      .subscribe({
        next: (patient) => {
          if (Object.keys(patient).length === 0) {
            this.store.dispatch(
              PatientFormStoreActions.setDiagnosticCount({ payload: 0 }),
            );
            this.resetFormNotFound();
            this.mapperToResourceToFailedEmptyForm(patient);
          } else {
            this.patient = patient;
            this.mapperToResourceToForm(patient);
            this.patientForm.patchValue(this.patient);
          }
        },
      });
  }

  mapperToResourceToFailedEmptyForm(resource: PatientResourceDto) {
    const form: PatientFormResourceDto = {
      rut: this.patientForm.get('rut')?.value || '',
      identification: this.patientForm.get('identification')?.value || '',
      name: '',
      lastName: '',
      isapre: '',
      diagnosisPatient: [],
    };
    this.store.dispatch(
      PatientFormStoreActions.createPatientForm({ payload: form }),
    );
  }

  mapperToResourceToForm(resource: PatientResourceDto) {
    const form: PatientFormResourceDto = {
      rut: resource.rut,
      identification: resource.identification,
      name: resource.name,
      lastName: resource.lastName,
      isapre: resource.isapre?.code || '',
      diagnosisPatient: [],
    };
    if (resource?.diagnosisPatient) {
      resource.diagnosisPatient.forEach((f) => {
        if (form.diagnosisPatient) {
          form.diagnosisPatient.push({
            cycleNumber: f.cycleNumber,
            cycleDay: f.cycleDay,
            doctor: f.doctor?.id || '',
            services: f.services?.code || '',
            diagnosis: f.diagnosis?.code || '',
            schema: f.schema?.code || '',
            hospitalUnit: f.hospitalUnit?.code || '',
          });
        }
      });
      this.store.dispatch(
        PatientFormStoreActions.createPatientForm({ payload: form }),
      );
    }
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
      const value = {
        ...this.patientForm.getRawValue(),
        isapre: this.patientForm.value.isapre?.code ?? null,
        type: this.typeIdentification,
      };
      this.store.dispatch(
        PatientFormStoreActions.createPatientForm({
          payload: value,
        }),
      );
      this.store.dispatch(
        PatientFormStoreActions.pushValidStateForm({
          payload: {
            ...this.statePatientFormValue,
            patientFormValid: true,
          },
        }),
      );
    }
  }

  resetForm(): void {
    this.patientForm.reset();
  }

  resetFormNotFound() {
    this.patientForm.patchValue({
      rut: this.patientForm.get('rut')?.value || '',
      identification: this.patientForm.get('identification')?.value || '',
      name: '',
      lastName: '',
      isapre: '',
    });
  }

  ngOnDestroy(): void {
    this.findPatientByIdentification$.unsubscribe();
    this.statePatientFormValue$.unsubscribe();
  }

  findValidFormPatient() {
    this.statePatientFormValue$ = this.store
      .select(PatientFormStoreSelectors.allStateValidForm)
      .subscribe({
        next: (stateForm) => {
          this.statePatientFormValue = stateForm;
        },
      });
  }

  private initCombos(): void {
    this.readIsapreCombo();
  }

  private readIsapreCombo() {
    this.store.dispatch(IsapreStoreActions.loadIsapre());
    this.isapreComboSubscription$ = this.store
      .select(IsapreStoreSelectors.selectComboIsapre)
      .pipe(filter((f) => !!f && f.length > 0))
      .subscribe({
        next: (data: ComboModelDto[] | []) => (this.isapreCombo = data),
      });
  }
  onTypeChange($event: any) {
    this.typeIdentification = $event.value;
  }
}
