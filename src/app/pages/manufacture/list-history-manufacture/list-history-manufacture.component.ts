import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MasterOrderService} from "../../../services/master-order.service";
import {DialogModule} from "primeng/dialog";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {PanelModule} from "primeng/panel";
import {CardModule} from "primeng/card";
import {MasterOrderResourceDto} from "../../../model/master-order/master-order-resource.dto";
import {ColumModelDto} from "../../../utils/models/colum-model.dto";
import {ButtonDirective} from "primeng/button";
import {Ripple} from "primeng/ripple";

@Component({
  selector: 'app-list-history-manufacture',
  standalone: true,
  imports: [
    DialogModule,
    NgForOf,
    PrimeTemplate,
    TableModule,
    PanelModule,
    CardModule,
    ButtonDirective,
    Ripple,
    NgIf,
    JsonPipe,
  ],
  templateUrl: './list-history-manufacture.component.html'
})
export class ListHistoryManufactureComponent implements OnInit{

  @Input ({required: true}) historyIdentification!: { identification: string, diagnosisOrder: string };
  @Output() historyClose = new EventEmitter<boolean>();
  @Output() historyUsed = new EventEmitter<MasterOrderResourceDto>();

  prepareDialogHistory = false;
  historyManufactureOrdersTable: MasterOrderResourceDto[] = [];
  originalManufactureOrdersTable: MasterOrderResourceDto[] = [];
  selectedMaster!: any;
  cols: ColumModelDto[] = [];
  metaKey: boolean = true;
  constructor(private readonly masterOrderService: MasterOrderService) {
  }

  private initColumns() {
    // this.cols = [
    //   {field: 'orderDetails.masterRecord', header: 'RM'},
    //   {field: 'orderDetails.productName', header: 'PA'},
    //   {field: 'orderDetails.complementName', header: 'Suero'},
    //   {field: 'cycleNumber', header: 'N° de Ciclo'},
    //   {field: 'cycleDay', header: 'Día de Ciclo'},
    // ];
    this.cols = [
      {field: 'masterRecord', header: 'RM'},
      {field: 'productName', header: 'PA'},
      {field: 'complementName', header: 'Suero'},
      {field: 'cycleNumber', header: 'N° de Ciclo'},
      {field: 'cycleDay', header: 'Día de Ciclo'},
    ];

  }

  ngOnInit(): void {
    this.masterOrderService.findAllHistoryMasterOrders(this.historyIdentification.identification, this.historyIdentification.diagnosisOrder).subscribe({
      next: (data) => {
        this.originalManufactureOrdersTable = data;
        this.historyManufactureOrdersTable = data.flatMap((master: any) =>
          master.orderDetails.map((detail: any) => ({
            ...detail,
            orderDetails: master.orderDetails,
            // masterRecord: master.masterRecord,
            cycleNumber: master.cycleNumber,
            cycleDay: master.cycleDay
          }))
        );
        this.prepareDialogHistory = true;
      },
      error: (error) => {
        console.error('Error fetching history of manufacture orders:', error);
      }
    });
    this.initColumns();
  }

  parseFieldInData(data: any, field: string) {
    const value = field.split('.').reduce((acc: any, obj: any) => {
      if (!acc) {
        return;
      }
      if (Array.isArray(acc[obj])) {
        return acc[obj][0];
      }
      if (field === 'batch') {
        return data.commercialOrderDetails
          .map((part: any) => part.batch)
          .join('//');
      }
      return acc[obj];
    }, data);
    if (field.includes('productionDate') && value) {
      return this.formatDate(value);
    }
    return value;
  }

  formatDate(date: Date) {
    // const date = new Date(inDate.getTime());
    const inDate = new Date(date);
    const day = String(inDate.getDate()).padStart(2, '0');
    const month = String(inDate.getMonth() + 1).padStart(2, '0');
    const year = String(inDate.getFullYear()).slice(-4);
    const hours = String(inDate.getHours()).padStart(2, '0');
    const minutes = String(inDate.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  onHide($event: any) {
    this.historyClose.emit(true);
  }

  hideDialog() {
    this.onHide(true);
  }

  usedHistory() {
    const selectedId = this.selectedMaster.id;
    const filteredDetail = this.selectedMaster.orderDetails.filter((detail: any) => detail.id === selectedId);
    this.selectedMaster = { ...this.selectedMaster, orderDetails: filteredDetail };
    this.historyUsed.emit(this.selectedMaster as MasterOrderResourceDto);
    this.hideDialog();
  }
}
