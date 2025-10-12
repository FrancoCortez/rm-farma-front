import {Component, OnInit} from '@angular/core';
import {TableModule} from "primeng/table";
import {ColumModelDto} from "../../../utils/models/colum-model.dto";
import {ButtonDirective} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {MultiSelectModule} from "primeng/multiselect";
import {NgForOf} from "@angular/common";
import {SelectButtonModule} from "primeng/selectbutton";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Ripple} from "primeng/ripple";
import {OrderDetailsService} from "../../../services/order-details.service";
import {
  OrderDetailsConcentrateReportResourceDto
} from "../../../model/master-order-details/order-details-concentrate-report.resource.dto";
import {HospitalUnitService} from "../../../services/hospital-unit.service";
import {HospitalUnitResourceDto} from "../../../model/hospital-unit/hospital-unit-resource.dto";
import {DropdownModule} from "primeng/dropdown";

@Component({
  selector: 'app-report-concentration',
  standalone: true,
  imports: [
    TableModule,
    ButtonDirective,
    CalendarModule,
    MultiSelectModule,
    SelectButtonModule,
    FormsModule,
    Ripple,
    NgForOf,
    DropdownModule,
    ReactiveFormsModule
  ],
  templateUrl: './report-concentration.component.html',
})
export class ReportConcentrationComponent implements OnInit {
  cols: ColumModelDto[] = [];
  _selectedColumns: ColumModelDto[] = [];
  nowDate = Date.now();
  loadingReport = false;
  manufactureReports: OrderDetailsConcentrateReportResourceDto[] = [];
  manufactureReportsBackup: OrderDetailsConcentrateReportResourceDto[] = [];
  searchDay: Date = new Date();
  hospitalUnitCombo!: HospitalUnitResourceDto [];

  get selectedColumns(): ColumModelDto[] {
    return this._selectedColumns;
  }


  set selectedColumns(val: ColumModelDto[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  ngOnInit() {
    this.initCombo();
    this.initColumns();
    this._selectedColumns = this.cols;
    this.selectedDay();
  }

  constructor(private readonly orderDetailService: OrderDetailsService, private readonly hospitalUnit: HospitalUnitService) {

  }

  initColumns() {
    this.cols = [
      {field: 'name', header: 'Nombre'},
      {field: 'hospitalName', header: 'U. Hospitalaria'},
      {field: 'productName', header: 'Droga'},
      {field: 'dose', header: 'Dosis (ML)'},
      {field: 'volumeTotalProduct', header: 'V Droga'},
      {field: 'laboratory', header: 'Laboratorio'},
      {field: 'volumeTotal', header: 'V Final (ML)'},
      {field: 'vehicle', header: 'Vehiculo'},
      {field: 'viaName', header: 'Via'},
      {field: 'down', header: 'Bajada'}
    ];
  }

  initCombo () {
    this.hospitalUnit.findAllHospitalUnit().subscribe({
      next: (data: HospitalUnitResourceDto[]) => {
        this.hospitalUnitCombo = data;
      }
    })
  }

  parseFieldInData(data: any, field: string) {
    const value = field.split('.').reduce((acc: any, obj: any) => {
      if (!acc) {
        return;
      }
      if (Array.isArray(acc[obj])) {
        return acc[obj][0];
      }
      if(field === 'dose') {
        return acc.dose + ' ' + acc.unitMetric;
      }

      if(field === 'volumeTotal') {
        return acc.volumeTotal + ' ML';
      }
      return acc[obj];
    }, data);
    return value;
  }

  selectedDay() {
    const startDate = new Date(this.searchDay.setHours(0, 0, 0, 0));
    const endDate = new Date(this.searchDay.setHours(23, 59, 59, 999));
    this.orderDetailService.concentrateReport(startDate, endDate).subscribe({
      next: data => {
        this.manufactureReports = data;
        this.manufactureReportsBackup = [...data];
      },
      complete: () => {
        this.loadingReport = false;
      }
    });
  }

  filterUnitHospital(value: any) {
    if(!value?.name) {
      this.manufactureReports = [...this.manufactureReportsBackup];
      return;
    }
    this.manufactureReports = this.manufactureReportsBackup.filter(f => f.hospitalName?.toLowerCase().includes(value.name.toLowerCase()));
  }
}
