import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { PatientResourceDto } from '../../../../model/patient/patient-resource.dto';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Button, ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { FormValidationMessagesComponent } from '../../../../utils/components/form-validation-messages/form-validation-messages.component';
import { PaginatorModule } from 'primeng/paginator';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormControlStatusDirective } from '../../../../utils/directives/form-control-status.directive';
import { Store } from '@ngrx/store';
import { RootStoreState } from '../../../../root-store';
import { InputTextModule } from 'primeng/inputtext';
import { DiagnosisPatientResourceDto } from '../../../../model/diagnosis-patient/diagnosis-patient-resource.dto';
import { ModalErrorComponent } from '../../../../utils/components/modal-error/modal-error.component';
import { DiagnosisOrderStateFormResourceDto } from '../../../../model/diagnosis-order-state/diagnosis-order-state-form-resource.dto';
import {
  DiagnosisOrderStoreActions,
  DiagnosisOrderStoreModule,
  DiagnosisOrderStoreSelectors,
} from '../../../../root-store/diagnosis-order-store';
import { ModalSuccessComponent } from '../../../../utils/components/modal-success/modal-success.component';
import { DiagnosisOrderStateService } from '../../../../services/diagnosis-order-state.service';
import { SpinnerComponent } from '../../../../utils/components/spinner/spinner.component';

@Component({
  selector: 'app-detail-patient',
  standalone: true,
  imports: [
    CardModule,
    NgForOf,
    ButtonDirective,
    Ripple,
    DialogModule,
    CalendarModule,
    FormValidationMessagesComponent,
    PaginatorModule,
    ReactiveFormsModule,
    FormControlStatusDirective,
    InputTextModule,
    ModalErrorComponent,
    DiagnosisOrderStoreModule,
    ModalSuccessComponent,
    NgIf,
    SpinnerComponent,
  ],
  templateUrl: './detail-patient.component.html',
})
export class DetailPatientComponent implements OnInit, OnDestroy {
  @Input() patientSearch!: PatientResourceDto;
  @Output() confirmEvent = new EventEmitter<boolean>();
  checkVisibility = false;
  checkPatientForm!: FormGroup;
  detailsPatientCheck!: DiagnosisPatientResourceDto;
  diagnosisOrderStateFormResourceDto!: DiagnosisOrderStateFormResourceDto;
  displayError = false;
  messageError = '';
  displayOk = false;
  messageOk = '';
  loadingPatient = false;

  constructor(
    private fb: FormBuilder,
    private readonly store: Store<RootStoreState.RootState>,
    private diagnosisOrderStateService: DiagnosisOrderStateService,
  ) {}

  initCheckPatientForm(cycleNumber?: number, cycleDay?: number) {
    this.checkPatientForm = this.fb.group({
      productionDate: [new Date(), Validators.required],
      cycleNumber: [cycleNumber || '', Validators.required],
      cycleDay: [cycleDay || '', Validators.required],
    });
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {}

  openClickDialogCheck(detailPatient: DiagnosisPatientResourceDto) {
    this.checkVisibility = true;
    this.initCheckPatientForm(
      detailPatient.cycleNumber,
      detailPatient.cycleDay,
    );
    this.detailsPatientCheck = detailPatient;
  }

  hideDialog() {
    this.checkVisibility = false;
  }

  saveCheckInitProcess() {
    this.diagnosisOrderStateFormResourceDto =
      this.checkPatientForm.getRawValue();
    this.diagnosisOrderStateFormResourceDto.patientIdentification =
      this.patientSearch.identification;
    this.diagnosisOrderStateFormResourceDto.diagnosisPatient =
      this.detailsPatientCheck.id;
    this.diagnosisOrderStateFormResourceDto.patient = this.patientSearch.id;
    this.diagnosisOrderStateService
      .createDiagnosisOrder(this.diagnosisOrderStateFormResourceDto)
      .subscribe({
        next: (value) => {
          this.loadingPatient = true;
          this.checkVisibility = false;
          this.messageOk = 'Se ha realizado el check de paciento con éxito';
          this.displayOk = true;
        },
        error: (error) => {
          this.messageError = 'Error al realizar el check de paciente';
          this.displayError = true;
        },
        complete: () => {
          this.loadingPatient = false;
        },
      });
  }

  confirmDialog($event: boolean) {
    this.displayOk = $event;
    this.messageOk = '';
    this.confirmEvent.emit(true);
  }

  confirmDialogError($event: boolean) {
    this.displayError = $event;
    this.messageError = '';
  }
}
