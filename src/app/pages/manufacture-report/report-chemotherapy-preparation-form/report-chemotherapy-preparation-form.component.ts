import { Component, OnInit } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgForOf, NgIf } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ColumModelDto } from '../../../utils/models/colum-model.dto';
import { ReportRecipeBookDto } from '../../../model/general-report/report-recipe-book.dto';
import { ExcelExportService } from '../../../utils/services/excel-export.service';
import { GeneralReportService } from '../../../services/general-report.service';
import { ChemotherapyPreparationFormDto } from '../../../model/general-report/chemotherapy-preparation-form.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-chemotherapy-preparation-form',
  standalone: true,
  imports: [
    Button,
    ButtonDirective,
    CalendarModule,
    MultiSelectModule,
    NgForOf,
    NgIf,
    PrimeTemplate,
    Ripple,
    SelectButtonModule,
    TableModule,
    FormsModule,
  ],
  templateUrl: './report-chemotherapy-preparation-form.component.html',
})
export class ReportChemotherapyPreparationFormComponent implements OnInit {
  cols: ColumModelDto[] = [];
  _selectedColumns: ColumModelDto[] = [];
  report: ChemotherapyPreparationFormDto[] = [];
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

  constructor(
    private readonly exportExcelService: ExcelExportService,
    private readonly generalReportService: GeneralReportService,
  ) {}
  ngOnInit() {
    this.initColumns();
    this.periodSearch();
    this._selectedColumns = this.cols;
    // this.searchDataReport(this.filterDate.startDate, this.filterDate.endDate);
  }

  initColumns() {
    this.cols = [
      { field: 'productionDate', header: 'FECHA DE ELABORACIÓN' },
      { field: 'productionDateHour', header: 'HORA DE ELABORACIÓN' },
      { field: 'masterRecord', header: 'N° DE RECETA MAGISTRAL' },
      { field: 'fullPatientName', header: 'PACIENTE' },
      { field: 'patientRut', header: 'RUT' },
      { field: 'service', header: 'SERVICIO' },
      { field: 'bed', header: 'CAMA' },
      { field: 'diagnosis', header: 'DIÁGNOSTICO' },
      { field: 'schema_de', header: 'ESQUEMA' },
      { field: 'cycleNumber', header: 'CICLO' },
      { field: 'cycleDay', header: 'DÍA' },
      { field: 'doctorName', header: 'MÉDICO' },
      { field: 'doctorRut', header: 'RUT MÉDICO' },
      { field: 'activeIngredient', header: 'PRINCIPIO ACTIVO' },
      { field: 'dose', header: 'DOSIS' },
      { field: 'batch', header: 'LOTE' },
      { field: 'laboratory', header: 'LABORATORIO' },
      { field: 'expirationDate', header: 'VENCIMIENTO' },
      { field: 'volumeTotal', header: 'VOLUMEN' },
      { field: 'complement', header: 'SUERO' },
      { field: 'via', header: 'VÍA DE ADMINISTRACIÓN' },
      { field: 'administrationTime', header: 'TIEMPO DE ADMINISTRACIÓN' },
      { field: 'administrationDate', header: 'FECHA DE ADMINISTRACIÓN' },
      {
        field: 'expirationAdministrationDate',
        header: 'FECHA DE VENCIMIENTO DE LA PREPARACIÓN',
      },
      {
        field: 'expirationAdministrationDateHour',
        header: 'HORA DE VENCIMIENTO DE LA PREPARACIÓN',
      },
      { field: 'conditionValue', header: 'CONSERVACIÓN' },
      { field: 'observation', header: 'OBSERVACIÓN' },
      { field: 'qfValidate', header: 'QF VALIDA' },
      { field: 'qfPrepare', header: 'QF PREPARA' },
      { field: 'technicalPrepare', header: 'TÉCNICO  QF DE ELABORACIÓN' },
      {
        field: 'qfConditioningTechnician',
        header: 'TÉCNICO QF DE ACONDICIONAMIENTO',
      },
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

  searchDataReport(startDate: Date, endDate: Date) {
    this.generalReportService
      .reportChemotherapyPreparationFormReport(startDate, endDate)
      .subscribe({
        next: (result) => {
          this.report = result;
        },
        error: (err) => {
          this.loadingReport = false;
        },
        complete: () => {
          this.loadingReport = false;
        },
      });
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

  protected exportExcel() {
    const exportData = this.report.map((item) => {
      const row: any = {};
      this.cols.forEach((col) => {
        row[col.header] = this.parseFieldInData(item, col.field);
      });
      return row;
    });
    this.exportExcelService.exportToExcel(
      exportData,
      `libro_recetas_${this.nowDate}.xlsx`,
    );
  }

  periodSearch() {
    this.loadingReport = true;
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
        this.report = [];
        this.loadingReport = false;
    }
  }
}
