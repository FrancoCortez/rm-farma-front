import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Store } from '@ngrx/store';
import {
  PatientStoreActions,
  PatientStoreModule,
  PatientStoreSelectors,
  RootStoreState,
} from '../../../root-store';
import { PatientResourceDto } from '../../../model/patient/patient-resource.dto';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgForOf } from '@angular/common';
import { ColumModelDto } from '../../../utils/models/colum-model.dto';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-patient',
  standalone: true,
  imports: [
    TableModule,
    PatientStoreModule,
    MultiSelectModule,
    NgForOf,
    FormsModule,
    ButtonDirective,
    Ripple,
  ],
  templateUrl: './list-patient.component.html',
})
export class ListPatientComponent implements OnInit {
  patients: PatientResourceDto[] = [];
  cols: ColumModelDto[] = [];
  subCols: ColumModelDto[] = [];
  expandedRows = {};

  constructor(
    private readonly store: Store<RootStoreState.RootState>,
    private router: Router,
  ) {}

  _selectedColumns: ColumModelDto[] = [];

  get selectedColumns(): ColumModelDto[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: ColumModelDto[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  ngOnInit(): void {
    this.initColumns();
    this._selectedColumns = this.cols;
    this.store.dispatch(PatientStoreActions.findAllPatients());
    this.store
      .select(PatientStoreSelectors.selectPatients)
      .subscribe((patients) => {
        this.patients = patients;
      });
  }

  initColumns(): void {
    this.cols = [
      { field: 'rut', header: 'RUT / Identificador' },
      { field: 'type', header: 'Tipo' },
      { field: 'name', header: 'Nombre' },
      { field: 'lastName', header: 'Apellido' },
      { field: 'isapre.description', header: 'Isapre' },
    ];
    //diagnosisPatient
    this.subCols = [
      { field: 'diagnosis.description', header: 'Diag.' },
      { field: 'cycleDay', header: 'Dia Ciclo' },
      { field: 'cycleNumber', header: 'Num. Ciclo' },
      { field: 'doctor.name', header: 'Dr. Nombre' },
      { field: 'schema.description', header: 'Esquema' },
      { field: 'services.description', header: 'Servicio' },
      { field: 'hospitalUnit.description', header: 'UN Hospitalaria' },
    ];
  }

  parseFieldInData(data: any, field: string) {
    const value = field.split('.').reduce((acc: any, obj: any) => {
      if (Array.isArray(acc[obj])) {
        return acc[obj][0];
      }
      return acc[obj];
    }, data);
    // if (field.includes('productionDate') && value) {
    //   return this.formatDate(value);
    // }
    return value;
  }

  searchPatient(patient: PatientResourceDto) {
    this.router.navigate(['/main/patient/add-patient', patient.identification]);
  }
}
