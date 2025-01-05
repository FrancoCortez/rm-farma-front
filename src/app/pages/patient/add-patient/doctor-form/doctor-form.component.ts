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
import { ButtonDirective } from 'primeng/button';
import { FormValidationMessagesComponent } from '../../../../utils/components/form-validation-messages/form-validation-messages.component';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { FormControlStatusDirective } from '../../../../utils/directives/form-control-status.directive';
import { RutFormatterDirective } from '../../../../utils/directives/rut-formatter.directive';
import { Ripple } from 'primeng/ripple';
import { Store } from '@ngrx/store';
import { PatientStoreSelectors, RootStoreState } from '../../../../root-store';
import { filter, Subscription } from 'rxjs';
import {
  DoctorStoreActions,
  DoctorStoreModule,
  DoctorStoreSelectors,
} from '../../../../root-store/doctor-store';
import { DoctorResourceDto } from '../../../../model/doctor/doctor-resource.dto';

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
    RutFormatterDirective,
    Ripple,
    DoctorStoreModule,
  ],
  templateUrl: './doctor-form.component.html',
})
export class DoctorFormComponent implements OnInit, OnDestroy {
  @Input() nextCallbacks: any;
  @Input() previousCallbacks: any;
  @Output() sendValueForm = new EventEmitter<FormGroup>();
  doctorForm!: FormGroup;

  loadPatient$: Subscription = new Subscription();
  loadDoctor$: Subscription = new Subscription();
  loadDoctor: DoctorResourceDto = {};

  constructor(
    private fb: FormBuilder,
    private readonly store: Store<RootStoreState.RootState>,
  ) {}

  ngOnInit(): void {
    this.doctorForm = this.fb.group({
      doctorRut: ['', [Validators.required, rutValidator()]],
      doctorName: [''],
      doctorLastName: ['', Validators.required],
      doctorPhone: [''],
      doctorEmail: ['', Validators.email],
    });
    this.loadPatient$ = this.store
      .select(PatientStoreSelectors.selectPatient)
      .pipe(filter((patient) => patient !== null))
      .subscribe({
        next: (patient) => {
          this.doctorForm.patchValue(patient);
        },
      });
    this.loadDoctor$ = this.store
      .select(DoctorStoreSelectors.selectDoctor)
      .pipe(filter((doctor) => doctor !== null))
      .subscribe({
        next: (doctor) => {
          console.log(doctor);
          this.loadDoctor = doctor;
          this.doctorForm.patchValue(doctor);
        },
      });
  }

  onRutBlur(): void {
    if (this.doctorForm.get('doctorRut')?.valid) {
      this.store.dispatch(
        DoctorStoreActions.loadDoctorFindRut({
          payload: this.doctorForm.get('doctorRut')?.value,
        }),
      );
    }
  }

  nextCallback(): void {
    if (this.doctorForm.valid) {
      this.emitFormValues();
      this.nextCallbacks.emit();
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
}
