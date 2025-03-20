import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { Ripple } from 'primeng/ripple';
import { AccordionModule } from 'primeng/accordion';
import { DetailPatientComponent } from '../../manufacture/add-manufacture/detail-patient/detail-patient.component';
import { ModalErrorComponent } from '../../../utils/components/modal-error/modal-error.component';
import { ModalSuccessComponent } from '../../../utils/components/modal-success/modal-success.component';
import { NgIf } from '@angular/common';
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

  constructor(private readonly store: Store<RootStoreState.RootState>) {}

  ngOnDestroy(): void {
    this.store.dispatch(PatientStoreActions.resetState());
  }

  ngOnInit(): void {
    this.loadSearchPatient();
    this.selectCreateSuccessFlag();
    this.loadingStatusPatient();
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
    this.store.dispatch(
      PatientStoreActions.findByIdentificationPatientReportError({
        payload: this.searchPatientValue,
      }),
    );
  }

  loadSearchPatient() {
    this.store
      .select(PatientStoreSelectors.selectPatient)
      .pipe(filter((f) => !!f))
      .subscribe({
        next: (patient) => {
          this.patientSearch = patient;
        },
      });
  }

  confirmDialog($event: boolean) {
    this.displayOk = $event;
  }

  private loadingStatusPatient() {
    this.store.select(PatientStoreSelectors.selectLoading).subscribe({
      next: (value) => {
        this.loadingPatient = value;
      },
    });
  }
}
