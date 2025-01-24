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
import { ButtonDirective } from 'primeng/button';
import { FormValidationMessagesComponent } from '../../../../../utils/components/form-validation-messages/form-validation-messages.component';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { FormControlStatusDirective } from '../../../../../utils/directives/form-control-status.directive';
import { Ripple } from 'primeng/ripple';
import { Store } from '@ngrx/store';
import { RootStoreState } from '../../../../../root-store';
import { filter, map, Subscription } from 'rxjs';
import {
  DoctorStoreActions,
  DoctorStoreModule,
  DoctorStoreSelectors,
} from '../../../../../root-store/doctor-store';
import { DoctorResourceDto } from '../../../../../model/doctor/doctor-resource.dto';
import { DropdownModule } from 'primeng/dropdown';
import { ComboModelDto } from '../../../../../utils/models/combo-model.dto';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf } from '@angular/common';
import { DoctorCreateResourceDto } from '../../../../../model/doctor/doctor-create-resource.dto';
import { RutFormatterDirective } from '../../../../../utils/directives/rut-formatter.directive';
import { rutValidator } from '../../../../../utils/form-validation/rut-validator.form';
import {
  PatientFormStoreActions,
  PatientFormStoreModule,
  PatientFormStoreSelectors,
} from '../../../../../root-store/patient-form-store';
import { DiagnosisPatientResourceDto } from '../../../../../model/diagnosis-patient/diagnosis-patient-resource.dto';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [
    ButtonDirective,
    FormValidationMessagesComponent,
    InputMaskModule,
    InputTextModule,
    FormControlStatusDirective,
    ReactiveFormsModule,
    Ripple,
    DoctorStoreModule,
    DropdownModule,
    CheckboxModule,
    NgIf,
    RutFormatterDirective,
    PatientFormStoreModule,
  ],
  templateUrl: './doctor-form.component.html',
})
export class DoctorFormComponent implements OnInit, OnDestroy {
  @Input() nextCallbacks: any;
  @Input() previousCallbacks: any;
  @Input() preLoadDiagnosisPatient?: DiagnosisPatientResourceDto = {};
  @Output() sendValueForm = new EventEmitter<FormGroup>();
  doctorForm!: FormGroup;
  doctorCreateForm!: FormGroup;
  doctorCombo: ComboModelDto[] = [];

  loadPatient$: Subscription = new Subscription();
  hiddenDropDoctor = true;

  statePatientFormValue!: {
    patientFormValid: boolean;
    diagnosticFormValid: boolean;
    cyclesFormValid: boolean;
    otherInformationFormValid: boolean;
    doctorFormValid: boolean;
  };
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
    this.doctorForm = this.fb.group({
      doctor: [null, Validators.required],
      checking: [false],
    });
    this.doctorCreateForm = this.fb.group({
      rut: ['', [Validators.required, rutValidator()]],
      name: ['', Validators.required],
    });
    this.store.dispatch(DoctorStoreActions.loadAllDoctors());
    this.selectCreateDoctor();
    this.generateComboDoctors();
    if (this.preLoadDiagnosisPatient) {
      this.doctorForm.patchValue({
        doctor: {
          code: this.preLoadDiagnosisPatient.doctor?.id || '',
          description: this.preLoadDiagnosisPatient.doctor?.name || '',
        },
      });
    }
  }

  nextCallback(): void {
    if (this.doctorForm.valid) {
      this.emitFormValues();
      this.nextCallbacks.emit();
      this.store.dispatch(
        PatientFormStoreActions.pushValidStateForm({
          payload: { ...this.statePatientFormValue, doctorFormValid: true },
        }),
      );
    }
  }

  previousCallback(): void {
    this.previousCallbacks.emit();
  }

  emitFormValues(): void {
    this.sendValueForm.emit(this.doctorForm);
  }

  resetForm(): void {
    this.doctorForm.reset();
  }

  ngOnDestroy(): void {
    this.loadPatient$.unsubscribe();
  }

  verifierDoctor(event: any): void {
    this.hiddenDropDoctor = event.checked.length === 0;
  }

  createDoctor() {
    if (this.doctorCreateForm.valid) {
      const doctorCreate: DoctorCreateResourceDto = this.doctorCreateForm.value;
      this.store.dispatch(
        DoctorStoreActions.createDoctor({ payload: doctorCreate }),
      );
    }
  }

  private generateComboDoctors() {
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

  private selectCreateDoctor() {
    this.store
      .select(DoctorStoreSelectors.selectCreateDoctor)
      .pipe(
        filter((f) => f !== null && f !== undefined),
        filter((f) => f.id !== null && f.id !== undefined),
        map((doctor) => {
          return {
            name: doctor.name,
            code: doctor.id,
          };
        }),
      )
      .subscribe({
        next: (doctor) => {
          this.doctorForm.patchValue({
            doctor: doctor,
          });
          this.hiddenDropDoctor = true;
          this.doctorCreateForm.reset();
          this.doctorForm.get('checking')?.setValue(false);
        },
      });
  }
}
