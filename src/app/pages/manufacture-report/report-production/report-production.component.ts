import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColumModelDto } from '../../../utils/models/colum-model.dto';
import { TableModule } from 'primeng/table';
import { OrderDetailsReportResourceDto } from '../../../model/master-order-details/order-details-report.resource.dto';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import {
  OrderDetailsStoreActions,
  OrderDetailsStoreModule,
  OrderDetailsStoreSelectors,
} from '../../../root-store/order-details-store';
import { Store } from '@ngrx/store';
import { RootStoreState } from '../../../root-store';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-report-production',
  standalone: true,
  imports: [
    TableModule,
    MultiSelectModule,
    FormsModule,
    NgForOf,
    OrderDetailsStoreModule,
    ButtonDirective,
    Ripple,
    SelectButtonModule,
    CalendarModule,
    NgIf,
  ],
  templateUrl: './report-production.component.html',
})
export class ReportProductionComponent implements OnInit, OnDestroy {
  cols: ColumModelDto[] = [];
  _selectedColumns: ColumModelDto[] = [];
  manufactureReports: OrderDetailsReportResourceDto[] = [];
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

    this._selectedColumns = this.cols;
    this.searchDataReport(this.filterDate.startDate, this.filterDate.endDate);
    this.getDataReport();
  }

  ngOnDestroy() {}

  initColumns() {
    this.cols = [
      { field: 'masterRecord', header: 'Registro Magistral (RM)' },
      { field: 'productionDate', header: 'Fecha de Elaboración' },
      { field: 'fullPatientName', header: 'Paciente' },
      { field: 'patientRut', header: 'Rut' },
      { field: 'doctorName', header: 'Médico' },
      { field: 'doctorRut', header: 'Rut' },
      { field: 'unitName', header: 'Clínica' },
      { field: 'code', header: 'Cod. Medicamento' },
      { field: 'description', header: 'Producto' },
      { field: 'quantity', header: 'Cantidad' },
      { field: 'quantityReal', header: 'ml/mg' },
      { field: 'laboratory', header: 'Laboratorio' },
      { field: 'batch', header: 'Lote' },
      { field: 'isapreCode', header: 'ISAPRE Cod.' },
      { field: 'isapreName', header: 'ISAPRE desc.' },
      { field: 'diagnosisCode', header: 'Diagnóstico Cod.' },
      { field: 'diagnosisName', header: 'Diagnóstico Desc.' },
      { field: 'cycleDay', header: 'Dia Ciclo' },
      { field: 'cycleNumber', header: 'Num. Ciclo' },
      { field: 'schemaCode', header: 'Esquema' },
      { field: 'schemaName', header: 'Esquema Desc.' },
      { field: 'volumeTotal', header: 'Volumen' },
      { field: 'viaCode', header: 'Via Cod.' },
      { field: 'viaDescription', header: 'Via Desc.' },
      { field: 'qf', header: 'Qf responsable' },
      { field: 'guia', header: 'Guia' },
    ];
  }

  searchDataReport(startDate: Date, endDate: Date) {
    this.store.dispatch(
      OrderDetailsStoreActions.findCustomReport({
        payload: { startDate, endDate },
      }),
    );
  }

  getDataReport() {
    this.store.select(OrderDetailsStoreSelectors.selectDataReport).subscribe({
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
    // if (field.includes('productionDate') && value) {
    //   return this.formatDate(value);
    // }
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
