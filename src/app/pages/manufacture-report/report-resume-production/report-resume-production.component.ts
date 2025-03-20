import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColumModelDto } from '../../../utils/models/colum-model.dto';
import { OrderDetailsReportResourceDto } from '../../../model/master-order-details/order-details-report.resource.dto';
import { Store } from '@ngrx/store';
import { RootStoreState } from '../../../root-store';
import {
  OrderDetailsStoreActions,
  OrderDetailsStoreModule,
  OrderDetailsStoreSelectors,
} from '../../../root-store/order-details-store';
import { Button } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { NgForOf, NgIf } from '@angular/common';
import {
  selectDataResumeReport,
  selectLoadingResumeReport,
} from '../../../root-store/order-details-store/selector';
import { OrderDetailsResumeReportResourceDto } from '../../../model/master-order-details/order-details-resume-report.resource.dto';

@Component({
  selector: 'app-report-resume-production',
  standalone: true,
  imports: [
    Button,
    CalendarModule,
    TableModule,
    MultiSelectModule,
    FormsModule,
    SelectButtonModule,
    NgIf,
    NgForOf,
    OrderDetailsStoreModule,
  ],
  templateUrl: './report-resume-production.component.html',
})
export class ReportResumeProductionComponent implements OnInit, OnDestroy {
  cols: ColumModelDto[] = [];
  _selectedColumns: ColumModelDto[] = [];
  manufactureReports: OrderDetailsResumeReportResourceDto[] = [];
  nowDate = Date.now();
  stateOptions = [
    { label: 'Hoy', value: 'hoy' },
    { label: '1 Semana', value: '1_semana' },
    { label: 'Mes Actual', value: '1_mes' },
    { label: 'Personalizado', value: 'personalize' },
  ];
  stateSelection = 'hoy';
  filterDate!: {
    startDate: Date;
    endDate: Date;
  };
  dateFilter: Date[] = [];
  loadingReport = false;

  get selectedColumns(): ColumModelDto[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: ColumModelDto[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  constructor(private readonly store: Store<RootStoreState.RootState>) {}

  ngOnInit() {
    this.initColumns();
    this.periodSearch();
    this.selectLoadingReport();
    this._selectedColumns = this.cols;
    this.searchDataReport(this.filterDate.startDate, this.filterDate.endDate);
    this.getDataReport();
  }

  ngOnDestroy() {
    this.store.dispatch(OrderDetailsStoreActions.resetStore());
  }

  initColumns() {
    this.cols = [
      { field: 'rut', header: 'NºH.C. (rut)' },
      { field: 'schemaName', header: 'Desc. Esquema' },
      { field: 'unitHospitalName', header: 'Unid. Hosp.' },
      { field: 'doctorName', header: 'Medico' },
      { field: 'masterRecord', header: 'R.M.' },
      { field: 'lastName', header: 'Apellidos' },
      { field: 'name', header: 'Nombre' },
      { field: 'productionDate', header: 'Fecha de Prep.' },
      { field: 'observation', header: 'Observaciones' },
      { field: 'genericProduct', header: 'Medicamentos' },
      { field: 'cycleNumber', header: 'CICLO' },
      { field: 'cycleDay', header: 'DIA' },
      { field: 'ov', header: 'OV' },
      { field: 'trainer', header: 'PREPARADOR' },
    ];
  }

  selectLoadingReport() {
    this.store
      .select(OrderDetailsStoreSelectors.selectLoadingResumeReport)
      .subscribe({
        next: (loading) => (this.loadingReport = loading),
      });
  }

  searchDataReport(startDate: Date, endDate: Date) {
    this.store.dispatch(
      OrderDetailsStoreActions.findResumeReport({
        payload: { startDate, endDate },
      }),
    );
  }

  getDataReport() {
    this.store
      .select(OrderDetailsStoreSelectors.selectDataResumeReport)
      .subscribe({
        next: (data) => {
          this.manufactureReports = data;
        },
      });
  }
  parseFieldInData(data: any, field: string) {
    const value = field.split('.').reduce((acc: any, obj: any) => {
      if (!acc) {
        return;
      }
      if (Array.isArray(acc[obj])) {
        return acc[obj][0];
      }
      return acc[obj];
    }, data);
    return value;
  }

  periodSearch() {
    switch (this.stateSelection) {
      case 'hoy':
        this.filterDate = {
          startDate: new Date(new Date().setHours(0, 0, 0, 0)),
          endDate: new Date(new Date().setHours(23, 59, 59, 999)),
        };
        this.searchDataReport(
          this.filterDate.startDate,
          this.filterDate.endDate,
        );
        break;
      case '1_semana':
        this.filterDate = {
          startDate: new Date(
            new Date(new Date().setDate(new Date().getDate() - 7)).setHours(
              0,
              0,
              0,
              0,
            ),
          ),
          endDate: new Date(new Date().setHours(23, 59, 59, 999)),
        };
        this.searchDataReport(
          this.filterDate.startDate,
          this.filterDate.endDate,
        );
        break;
      case '1_mes':
        const now = new Date();
        this.filterDate = {
          startDate: new Date(
            new Date(now.getFullYear(), now.getMonth(), 1).setHours(0, 0, 0, 0),
          ),
          endDate: new Date(new Date().setHours(23, 59, 59, 999)),
        };
        this.searchDataReport(
          this.filterDate.startDate,
          this.filterDate.endDate,
        );
        break;
      default:
        console.log('Invalid state selection');
    }
  }

  searchPersonalize() {
    if (this.stateSelection === 'personalize') {
      this.filterDate = {
        startDate: this.dateFilter[0],
        endDate: this.dateFilter[1],
      };
      this.searchDataReport(this.filterDate.startDate, this.filterDate.endDate);
    }
  }
}
