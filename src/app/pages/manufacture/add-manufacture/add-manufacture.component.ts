import { Component, OnDestroy, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  PatientStoreActions,
  PatientStoreModule,
  PatientStoreSelectors,
  RootStoreState,
} from '../../../root-store';
import { PatientResourceDto } from '../../../model/patient/patient-resource.dto';
import { ModalErrorComponent } from '../../../utils/components/modal-error/modal-error.component';
import { ModalSuccessComponent } from '../../../utils/components/modal-success/modal-success.component';
import { ErrorModelDto } from '../../../utils/models/error-model.dto';
import { filter } from 'rxjs';
import { CardModule } from 'primeng/card';
import { DetailPatientComponent } from './detail-patient/detail-patient.component';
import { NgIf } from '@angular/common';
import { DetailFormulaComponent } from './detail-formula/detail-formula.component';
import {
  MasterOrderStoreActions,
  MasterOrderStoreModule,
  MasterOrderStoreSelectors,
} from '../../../root-store/master-order-store';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-add-manufacture',
  standalone: true,
  imports: [
    InputTextModule,
    Ripple,
    Button,
    AccordionModule,
    FormsModule,
    PatientStoreModule,
    ModalErrorComponent,
    ModalSuccessComponent,
    CardModule,
    DetailPatientComponent,
    NgIf,
    DetailFormulaComponent,
    MasterOrderStoreModule,
  ],
  templateUrl: './add-manufacture.component.html',
})
export class AddManufactureComponent implements OnInit, OnDestroy {
  searchPatientValue: string = '';
  patientSearch: PatientResourceDto = {};
  displayError: boolean = false;
  messageError?: string = '';
  displayOk: boolean = false;
  messageOk = 'Se ha creado la orden de producción correctamente';

  constructor(
    private readonly store: Store<RootStoreState.RootState>,
    private readonly localStorage: LocalStorageService,
  ) {}

  ngOnDestroy(): void {
    this.store.dispatch(PatientStoreActions.resetState());
  }

  loadPatientLocal() {
    const local = this.localStorage.readLocalStorage('') || [];
  }

  ngOnInit(): void {
    this.store
      .select(MasterOrderStoreSelectors.successCreateOrUpdate)
      .subscribe({
        next: (loader) => {
          if (loader) {
            this.displayOk = true;
            this.store.dispatch(
              MasterOrderStoreActions.selectSuccessCreateOrUpdateChange({
                payload: false,
              }),
            );
          }
        },
      });

    this.store
      .select(PatientStoreSelectors.selectPatient)
      .pipe(filter((f) => !!f))
      .subscribe({
        next: (patient) => {
          this.patientSearch = patient;
        },
      });

    this.store
      .select(PatientStoreSelectors.selectErrorForProduction)
      .pipe(filter((f) => !!f))
      .subscribe({
        next: (errors) => {
          const realError = errors as ErrorModelDto;
          this.messageError = realError.errors?.[0];
          this.displayError = true;
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

  confirmDialog($event: boolean) {
    this.displayOk = $event;
  }
}
