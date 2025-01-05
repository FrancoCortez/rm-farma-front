import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';
import { CyclesFormComponent } from './cycles-form/cycles-form.component';
import { OtherInformationFormComponent } from './other-information-form/other-information-form.component';
import { PatientFormResourceDto } from '../../../model/patient/patient-form-resource.dto';
import { FormGroup } from '@angular/forms';
import { SpinnerComponent } from '../../../utils/components/spinner/spinner.component';
import { NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  PatientStoreActions,
  PatientStoreSelectors,
  RootStoreState,
} from '../../../root-store';
import { Subscription } from 'rxjs';
import { ModalErrorComponent } from '../../../utils/components/modal-error/modal-error.component';
import { ErrorModelDto } from '../../../utils/models/error-model.dto';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    StepperModule,
    PatientFormComponent,
    DoctorFormComponent,
    CyclesFormComponent,
    OtherInformationFormComponent,
    SpinnerComponent,
    NgIf,
    ModalErrorComponent,
  ],
  templateUrl: './add-patient.component.html',
})
export class AddPatientComponent implements OnInit, OnDestroy {
  dataAllForm: PatientFormResourceDto = {};
  isLoading = false;
  displayError = false;
  messageError? = '';

  @ViewChild(PatientFormComponent) patientFormComponent!: PatientFormComponent;
  @ViewChild(DoctorFormComponent) doctorFormComponent!: DoctorFormComponent;
  @ViewChild(CyclesFormComponent) cyclesFormComponent!: CyclesFormComponent;
  @ViewChild(OtherInformationFormComponent)
  otherInformationFormComponent!: OtherInformationFormComponent;

  isLoadingSpinner$: Subscription = new Subscription();
  isLoading$: Subscription = new Subscription();
  isLoader$: Subscription = new Subscription();
  selectError$: Subscription = new Subscription();

  constructor(private readonly store: Store<RootStoreState.RootState>) {}

  ngOnInit(): void {
    this.isLoading$ = this.store
      .select(PatientStoreSelectors.selectLoading)
      .subscribe({
        next: (loading) => (this.isLoading = loading),
      });
    this.isLoader$ = this.store
      .select(PatientStoreSelectors.selectLoader)
      .subscribe({
        next: (loader) => {
          if (loader) this.resetAllForms();
        },
      });
    this.selectError$ = this.store
      .select(PatientStoreSelectors.selectError)
      .subscribe({
        next: (errors) => {
          if (errors) {
            const realError = errors as ErrorModelDto;
            this.messageError = realError.message;
            this.displayError = true;
          }
        },
      });
  }

  addDataPatientForm(form: FormGroup) {
    if (form.valid) {
      this.dataAllForm = { ...this.dataAllForm, ...form.getRawValue() };
    }
  }

  addDataDoctorForm(form: FormGroup) {
    if (form.valid) {
      this.dataAllForm = { ...this.dataAllForm, ...form.value };
    }
  }

  addDataCyclesForm(form: FormGroup) {
    if (form.valid) {
      this.dataAllForm = { ...this.dataAllForm, ...form.value };
    }
  }

  addDataOtherInformationForm(form: FormGroup) {
    if (form.valid) {
      const otherInformationFormValue = {
        clinic: form.value.clinic.code,
        schema: form.value.schema.code,
        isapre: form.value.isapre.code,
        diagnosis: form.value.diagnosis.code,
      };
      this.dataAllForm = { ...this.dataAllForm, ...otherInformationFormValue };
      this.store.dispatch(
        PatientStoreActions.createPatient({ payload: this.dataAllForm }),
      );
    }
  }

  resetAllForms(): void {
    this.patientFormComponent.resetForm();
    this.doctorFormComponent.resetForm();
    this.cyclesFormComponent.resetForm();
    this.otherInformationFormComponent.resetForm();
  }

  ngOnDestroy(): void {
    this.isLoadingSpinner$.unsubscribe();
    this.isLoading$.unsubscribe();
    this.isLoader$.unsubscribe();
    this.selectError$.unsubscribe();
  }
}
