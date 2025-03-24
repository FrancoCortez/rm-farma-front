import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { Ripple } from 'primeng/ripple';
import { AccordionModule } from 'primeng/accordion';
import { DetailPatientComponent } from '../../manufacture/add-manufacture/detail-patient/detail-patient.component';
import { ModalErrorComponent } from '../../../utils/components/modal-error/modal-error.component';
import { ModalSuccessComponent } from '../../../utils/components/modal-success/modal-success.component';
import { JsonPipe, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  PatientStoreActions,
  PatientStoreModule,
  PatientStoreSelectors,
  RootStoreState,
} from '../../../root-store';
import { PatientResourceDto } from '../../../model/patient/patient-resource.dto';
import { filter } from 'rxjs';
import {
  DiagnosisOrderStoreModule,
  DiagnosisOrderStoreSelectors,
} from '../../../root-store/diagnosis-order-store';
import { SpinnerComponent } from '../../../utils/components/spinner/spinner.component';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-check-patient-detail',
  standalone: true,
  imports: [
    Button,
    InputTextModule,
    PaginatorModule,
    Ripple,
    AccordionModule,
    DetailPatientComponent,
    ModalErrorComponent,
    ModalSuccessComponent,
    NgIf,
    PatientStoreModule,
    DiagnosisOrderStoreModule,
    SpinnerComponent,
    JsonPipe,
  ],
  templateUrl: './check-patient-detail.component.html',
})
export class CheckPatientDetailComponent implements OnInit, OnDestroy {
  searchPatientValue: string = '';
  patientSearch: PatientResourceDto = {};

  loadingPatient = false;

  displayError: boolean = false;
  displayOk: boolean = false;
  messageError?: string = '';

  constructor(
    private readonly store: Store<RootStoreState.RootState>,
    private patientService: PatientService,
  ) {}

  ngOnDestroy(): void {
    this.store.dispatch(PatientStoreActions.resetState());
  }

  ngOnInit(): void {
    this.selectCreateSuccessFlag();
  }

  selectCreateSuccessFlag() {
    this.store
      .select(DiagnosisOrderStoreSelectors.selectCreateSuccessFlag)
      .subscribe({
        next: (value) => {
          if (value) {
            this.searchPatient();
          }
        },
      });
  }

  searchPatient() {
    this.patientService
      .findByIdentificationPatent(this.searchPatientValue)
      .subscribe({
        next: (patient) => {
          this.loadingPatient = true;
          this.patientSearch = patient;
        },
        error: (error) => {
          this.messageError = 'Paciente no encontrado.';
          this.displayError = true;
          this.patientSearch = {};
        },
        complete: () => {
          this.loadingPatient = false;
        },
      });
  }

  onConfirmEvent(event: boolean) {
    if (event) {
      this.searchPatient();
    }
  }

  confirmDialog($event: boolean) {
    this.displayOk = $event;
  }

  confirmDialogError($event: boolean) {
    this.displayError = $event;
  }
}
