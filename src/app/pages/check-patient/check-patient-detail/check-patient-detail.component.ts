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
  RootStoreState,
} from '../../../root-store';
import { PatientResourceDto } from '../../../model/patient/patient-resource.dto';
import {
  DiagnosisOrderStoreModule,
  DiagnosisOrderStoreSelectors,
} from '../../../root-store/diagnosis-order-store';
import { SpinnerComponent } from '../../../utils/components/spinner/spinner.component';
import { PatientService } from '../../../services/patient.service';
import { Subject } from 'rxjs';
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";

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
    AutoCompleteModule,
  ],
  templateUrl: './check-patient-detail.component.html',
})
export class CheckPatientDetailComponent implements OnInit, OnDestroy {
  searchPatientValue: {identification: string, label:string} = {identification: '', label: ''};
  patientSearch: PatientResourceDto = {};

  loadingPatient = false;

  displayError: boolean = false;
  displayOk: boolean = false;
  messageError?: string = '';

  suggestions: {identification: string, label:string}[] = [];
  initSuggestions: {identification: string, label:string}[] = [];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store<RootStoreState.RootState>,
    private patientService: PatientService,
  ) {}

  ngOnDestroy(): void {
    this.store.dispatch(PatientStoreActions.resetState());
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.selectCreateSuccessFlag();
    this.patientService.deboudPatient('').subscribe((value) => {
      this.suggestions = value;
      this.initSuggestions = value;
    });
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
      .findByIdentificationPatent(this.searchPatientValue?.identification)
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

  filterPatient(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.initSuggestions as any[]).length; i++) {
      let filterSuggestion = (this.initSuggestions as any[])[i];
      if (filterSuggestion.label.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
        filtered.push(filterSuggestion);
      }
    }
    this.suggestions = filtered;
  }
}
