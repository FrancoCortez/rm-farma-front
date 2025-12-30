import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgForOf, NgIf } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Table, TableModule } from 'primeng/table';
import { ColumModelDto } from '../../../utils/models/colum-model.dto';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { OrderDetailsService } from '../../../services/order-details.service';
import { OrderDetailsHistoryPatientDto } from '../../../model/master-order-details/order-details-history-patient.dto';
import { InputTextModule } from 'primeng/inputtext';
import { ExcelExportService } from '../../../utils/services/excel-export.service';

@Component({
  selector: 'app-report-history-patient',
  standalone: true,
  imports: [
    ButtonDirective,
    CalendarModule,
    MultiSelectModule,
    NgForOf,
    PrimeTemplate,
    Ripple,
    SelectButtonModule,
    TableModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
  ],
  templateUrl: './report-history-patient.component.html',
})
export class ReportHistoryPatientComponent implements OnInit {
  cols: ColumModelDto[] = [];
  _selectedColumns: ColumModelDto[] = [];
  nowDate = Date.now();
  loadingReport = false;
  historyPatient: OrderDetailsHistoryPatientDto[] = [];
  searchDay: Date = new Date();

  get selectedColumns(): ColumModelDto[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: ColumModelDto[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  ngOnInit() {
    this.initColumns();
    this._selectedColumns = this.cols;
    this.orderDetailService.historyPatientReport().subscribe({
      next: (result) => {
        let dataFinalParse: OrderDetailsHistoryPatientDto[] = [];
        console.log(result);
        for (const dataParse of result) {
          dataFinalParse.push({
            ...dataParse,
            productionDate: this.formatDateTimeSeparated(
              dataParse.productionDate,
            ).formattedDate,
            productionDateHour: this.formatDateTimeSeparated(
              dataParse.productionDate,
            ).formattedTime,
            expirationDate: this.formatDateTimeSeparated(
              dataParse.expirationDate,
            ).formattedDate,
            expirationAdministrationDate: this.formatDateTimeSeparated(
              dataParse.expirationAdministrationDate,
            ).formattedDate,
            expirationAdministrationDateHour: this.formatDateTimeSeparated(
              dataParse.expirationAdministrationDate,
            ).formattedTime,
            administrationDate: this.formatDateTimeSeparated(
              dataParse.administrationDate,
            ).formattedDate,
          });
        }
        this.historyPatient = dataFinalParse;
      },
      error: (error: Error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }

  constructor(
    private readonly orderDetailService: OrderDetailsService,
    private readonly exportExcelService: ExcelExportService,
  ) {}

  formatDateToString(date: any) {
    const inDate = new Date(date);
    console.log(inDate);
    const day = String(inDate.getDate()).padStart(2, '0');
    const month = String(inDate.getMonth() + 1).padStart(2, '0');
    const year = String(inDate.getFullYear()).slice(-4);
    const hours = String(inDate.getHours()).padStart(2, '0');
    const minutes = String(inDate.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  formatDateTimeSeparated(inDate: any) {
    const date = this.formatDateToString(inDate as Date);
    const [datePart, timePart] = date.split(' ');
    const [dayExtract, monthExtract, yearExtract] = datePart.split('/');
    const [hoursExtract, minutesExtract] = timePart.split(':');
    const dateExtract = new Date(
      Number(yearExtract),
      Number(monthExtract) - 1,
      Number(dayExtract),
      Number(hoursExtract),
      Number(minutesExtract),
    );
    const day = String(dateExtract.getDate()).padStart(2, '0');
    const month = String(dateExtract.getMonth() + 1).padStart(2, '0');
    const year = dateExtract.getFullYear();
    const hours = String(dateExtract.getHours()).padStart(2, '0');
    const minutes = String(dateExtract.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}`;
    return {
      formattedDate,
      formattedTime,
    };
  }

  initColumns() {
    this.cols = [
      { field: 'productionDate', header: 'Fecha de Elaboración' },
      { field: 'productionDateHour', header: 'Hora de Elaboración' },
      { field: 'masterRecord', header: 'Registro Magistral' },
      { field: 'fullPatientName', header: 'Paciente' },
      { field: 'patientRut', header: 'RUT' },
      { field: 'patientIdentification', header: 'Identificación' },
      { field: 'service', header: 'Servicio' },
      { field: 'bed', header: 'Cama' },
      { field: 'diagnosis', header: 'Diagnóstico' },
      { field: 'schema_de', header: 'Esquema' },
      { field: 'cycleNumber', header: 'Ciclo' },
      { field: 'cycleDay', header: 'Día' },
      { field: 'doctorName', header: 'Médico' },
      { field: 'doctorRut', header: 'RUT Médico' },
      { field: 'activeIngredient', header: 'Principio Activo' },
      { field: 'dose', header: 'Dosis' },
      { field: 'batch', header: 'Lote' },
      { field: 'laboratory', header: 'Laboratorio' },
      { field: 'expirationDate', header: 'Vencimiento' },
      { field: 'volumeTotal', header: 'Volumen' },
      { field: 'complement', header: 'Suero' },
      { field: 'via', header: 'Vía de Administración' },
      { field: 'administrationTime', header: 'Tiempo de Administración' },
      { field: 'administrationDate', header: 'Fecha de Administración' },
      {
        field: 'expirationAdministrationDate',
        header: 'Fecha de Vencimiento de la preparación',
      },
      {
        field: 'expirationAdministrationDateHour',
        header: 'Hora de Vencimiento de la preparación',
      },
      { field: 'conditionValue', header: 'Condición' },
      { field: 'observation', header: 'Observación' },
      { field: 'qfValidate', header: 'QF Valida' },
      { field: 'qfPrepare', header: 'QF Prepara' },
      { field: 'technicalPrepare', header: 'Técnico Prepara' },
      { field: 'qfConditioningTechnician', header: 'QF Técnico Acondiciona' },
      { field: 'episode', header: 'Episodio' },
      { field: 'observationNurse', header: 'Observaciones' },
    ];
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

  protected onGlobalFilter(dt: Table, event: Event) {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  protected exportExcel() {
    const exportData = this.historyPatient.map((item) => {
      const row: any = {};
      this.cols.forEach((col) => {
        row[col.header] = this.parseFieldInData(item, col.field);
      });
      return row;
    });
    this.exportExcelService.exportToExcel(
      exportData,
      `report-history_patient_${this.nowDate}.xlsx`,
    );
  }
}
