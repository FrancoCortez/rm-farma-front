import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientFormResourceDto } from '../../../model/patient/patient-form-resource.dto';
import { SpinnerComponent } from '../../../utils/components/spinner/spinner.component';
import { NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  PatientStoreActions,
  PatientStoreModule,
  PatientStoreSelectors,
  RootStoreState,
} from '../../../root-store';
import { filter, Subscription } from 'rxjs';
import { ModalErrorComponent } from '../../../utils/components/modal-error/modal-error.component';
import { ErrorModelDto } from '../../../utils/models/error-model.dto';
import { ModalSuccessComponent } from '../../../utils/components/modal-success/modal-success.component';
import { ActivatedRoute } from '@angular/router';
import { DiagnosisPatientFormComponent } from './diagnosis-patient-form/diagnosis-patient-form.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { DiagnosisPatientFormResourceDto } from '../../../model/diagnosis-patient/diagnosis-patient-form-resource.dto';
import {
  PatientFormStoreModule,
  PatientFormStoreSelectors,
} from '../../../root-store/patient-form-store';
import { PatientResourceDto } from '../../../model/patient/patient-resource.dto';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    StepperModule,
    PatientFormComponent,
    SpinnerComponent,
    NgIf,
    ModalErrorComponent,
    ModalSuccessComponent,
    PatientStoreModule,
    DiagnosisPatientFormComponent,
    ButtonDirective,
    Ripple,
    PatientFormStoreModule,
    NgForOf,
  ],
  templateUrl: './add-patient.component.html',
})
export class AddPatientComponent implements OnInit, OnDestroy {
  dataAllForm: PatientFormResourceDto = {};
  isLoading = false;
  displayError = false;
  displayOk = false;
  messageError? = '';
  patientFormValid = false;
  patient: PatientResourceDto = {};
  diagnosisForms: number[] = [0];

  @ViewChild(PatientFormComponent) patientFormComponent!: PatientFormComponent;
  @ViewChild(DiagnosisPatientFormComponent)
  diagnosisPatientFormComponent!: DiagnosisPatientFormComponent;

  isLoadingSpinner$: Subscription = new Subscription();
  isLoading$: Subscription = new Subscription();
  isLoader$: Subscription = new Subscription();
  selectError$: Subscription = new Subscription();
  dataAllFormSubscription$: Subscription = new Subscription();
  formValidPatient$: Subscription = new Subscription();
  statePatientFormValue$: Subscription = new Subscription();

  statePatientFormValue!: {
    patientFormValid: boolean;
    diagnosticFormValid: boolean;
    cyclesFormValid: boolean;
    otherInformationFormValid: boolean;
    doctorFormValid: boolean;
  };

  constructor(
    private readonly store: Store<RootStoreState.RootState>,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
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

  readDataForm() {
    this.dataAllFormSubscription$ = this.store
      .select(PatientFormStoreSelectors.getFormPatient)
      .subscribe({
        next: (patientCreate) => {
          this.dataAllForm = patientCreate;
        },
      });
  }

  getDiagnosisCount() {
    this.store.select(PatientFormStoreSelectors.getDiagnosisCount).subscribe({
      next: (count) => {
        for (let i = 1; i < count; i++) {
          this.addDiagnosticForm();
        }
      },
    });
  }

  ngOnInit(): void {
    this.getDiagnosisCount();
    this.readStateFormPatient();
    this.initialForList();
    this.readDataForm();
    this.store
      .select(PatientStoreSelectors.selectPatient)
      .pipe(filter((patient) => !!patient))
      .subscribe({
        next: (patient) => {
          this.patient = patient;
        },
      });
    this.isLoading$ = this.store
      .select(PatientStoreSelectors.selectLoading)
      .subscribe({
        next: (loading) => (this.isLoading = loading),
      });
    this.isLoader$ = this.store
      .select(PatientStoreSelectors.selectSuccessCreateOrUpdate)
      .subscribe({
        next: (loader) => {
          if (loader) {
            this.displayOk = true;
            this.resetAllForms();
            this.diagnosisForms = [0];
            this.store.dispatch(
              PatientStoreActions.selectSuccessCreateOrUpdateChange({
                payload: false,
              }),
            );
          }
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
    this.readStatusForms();
  }

  initialForList() {
    this.route.paramMap.subscribe((params) => {
      this.ngZone.run(() => {
        const param = params.get('identification');
        if (param && param !== '0') {
          this.store.dispatch(
            PatientStoreActions.findByIdentificationPatient({ payload: param }),
          );
          this.cdr.detectChanges();
        }
      });
    });
  }

  addDataDiagnosisPatientForm(data: DiagnosisPatientFormResourceDto[]) {
    this.dataAllForm = {
      ...this.dataAllForm,
      diagnosisPatient: data,
    };
  }

  dataValid() {
    return (
      this.statePatientFormValue.patientFormValid &&
      this.statePatientFormValue.cyclesFormValid &&
      this.statePatientFormValue.doctorFormValid &&
      this.statePatientFormValue.diagnosticFormValid &&
      this.statePatientFormValue.otherInformationFormValid
    );
  }

  resetAllForms(): void {
    this.patientFormComponent.resetForm();
    this.diagnosisPatientFormComponent.resetAllForms();
  }

  readStatusForms() {
    this.formValidPatient$ = this.store
      .select(PatientFormStoreSelectors.allStateValidForm)
      .subscribe({
        next: (stateForm) => {
          this.statePatientFormValue = stateForm;
        },
      });
  }

  ngOnDestroy(): void {
    this.isLoadingSpinner$.unsubscribe();
    this.isLoading$.unsubscribe();
    this.isLoader$.unsubscribe();
    this.selectError$.unsubscribe();
    this.dataAllFormSubscription$.unsubscribe();
    this.formValidPatient$.unsubscribe();
  }

  confirmDialog($event: boolean) {
    this.displayOk = $event;
  }

  saveAll() {
    console.log(this.dataAllForm);
    this.store.dispatch(
      PatientStoreActions.createPatient({ payload: this.dataAllForm }),
    );
  }

  addDiagnosticForm() {
    this.diagnosisForms.push(this.diagnosisForms.length);
  }
}
