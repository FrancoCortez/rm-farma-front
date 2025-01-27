import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgForOf } from '@angular/common';
import { PrimeNGConfig, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ColumModelDto } from '../../../utils/models/colum-model.dto';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { Store } from '@ngrx/store';
import { RootStoreState } from '../../../root-store';
import { Subscription } from 'rxjs';
import {
  MasterOrderStoreActions,
  MasterOrderStoreModule,
  MasterOrderStoreSelectors,
} from '../../../root-store/master-order-store';
import { Ripple } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormValidationMessagesComponent } from '../../../utils/components/form-validation-messages/form-validation-messages.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormControlStatusDirective } from '../../../utils/directives/form-control-status.directive';
import {
  ProductStoreActions,
  ProductStoreModule,
  ProductStoreSelectors,
} from '../../../root-store/product-store';
import {
  ViaStoreActions,
  ViaStoreModule,
  ViaStoreSelectors,
} from '../../../root-store/via-store';
import {
  ComplementStoreActions,
  ComplementStoreModule,
  ComplementStoreSelectors,
} from '../../../root-store/complement-store';
import { ComboModelDto } from '../../../utils/models/combo-model.dto';
import { MasterOrderFormResourceDto } from '../../../model/master-order/master-order-form-resource.dto';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
  CommercialProductStoreActions,
  CommercialProductStoreModule,
  CommercialProductStoreSelectors,
} from '../../../root-store/commercial-product-store';
import { ZebraPrintService } from '../../../utils/services/zebra-print.service';

@Component({
  selector: 'app-list-manufacture',
  standalone: true,
  imports: [
    MultiSelectModule,
    NgForOf,
    PrimeTemplate,
    TableModule,
    FormsModule,
    CalendarModule,
    InputTextModule,
    ReactiveFormsModule,
    MasterOrderStoreModule,
    Ripple,
    DialogModule,
    DropdownModule,
    FormValidationMessagesComponent,
    InputNumberModule,
    InputTextareaModule,
    FormControlStatusDirective,
    ProductStoreModule,
    ComplementStoreModule,
    ViaStoreModule,
    RadioButtonModule,
    CommercialProductStoreModule,
  ],
  providers: [PrimeNGConfig],
  templateUrl: './list-manufacture.component.html',
})
export class ListManufactureComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  cols: ColumModelDto[] = [];
  subCols: ColumModelDto[] = [];
  detailTableCols: ColumModelDto[] = [];
  expandedRows = {};
  masterOrders: any[] = [];
  searchDay!: Date;
  searchIdentification: string = '';
  currentTableSelectedDetail!: any;
  currentTableSelectedMaster!: any;
  masterOrderForm: MasterOrderFormResourceDto[] = [];

  productCombo: ComboModelDto[] = [];
  complementCombo: ComboModelDto[] = [];
  viaCombo: ComboModelDto[] = [];
  commercialProductCombo: ComboModelDto[] = [];
  unitMetricCombo: ComboModelDto[] = [];
  conditionCombo: ComboModelDto[] = [];

  orderDetailDialog = false;
  orderDetailForm!: FormGroup;

  masterOrdersSubscription$: Subscription = new Subscription();
  productComboSubscription$: Subscription = new Subscription();
  complementComboSubscription$: Subscription = new Subscription();
  viaComboSubscription$: Subscription = new Subscription();
  _selectedColumns: ColumModelDto[] = [];
  prepareDialogDetail = false;
  masterDetailTable: any[] = [];
  commercialProductCombo$: Subscription = new Subscription();
  zebraPreview = false;
  printDetail!: {
    detail: any;
    master: any;
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly store: Store<RootStoreState.RootState>,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private cdr: ChangeDetectorRef,
    private zebraPrintService: ZebraPrintService,
  ) {}

  ngAfterViewInit() {
    this.primengConfig.ripple = true;
  }

  initFormOrderDetails() {
    const date = new Date(
      this.currentTableSelectedDetail.productionDate * 1000,
    );
    const expirationDate = new Date(
      this.currentTableSelectedDetail.productionDate * 1000,
    );
    expirationDate.setDate(expirationDate.getDate() + 4);
    this.orderDetailForm = this.fb.group({
      via: ['', Validators.required],
      productionDate: [date, Validators.required],
      expirationDate: [expirationDate, Validators.required],
      productName: ['', Validators.required],
      dose: [null, Validators.required],
      unitMetric: ['', Validators.required],
      complement: ['', Validators.required],
      volTotal: [null, Validators.required],
      prot: ['Si'],
      condition: [''],
      administrationTime: [null, Validators.required],
      observation: [''],
      commercialPart: this.fb.array([this.createCommercialPart()]),
    });
  }

  createCommercialPart(): FormGroup {
    return this.fb.group({
      commercial: [''],
      batch: [''],
      part: [''],
    });
  }

  get commercialPart(): FormArray {
    return this.orderDetailForm.get('commercialPart') as FormArray;
  }

  addOrderPart() {
    this.commercialPart.push(this.createCommercialPart());
    this.cdr.detectChanges();
  }

  removeOrderPart(index: number) {
    if (this.commercialPart.length > 1) {
      this.commercialPart.removeAt(index);
    }
  }

  get selectedColumns(): ColumModelDto[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: ColumModelDto[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  ngOnDestroy(): void {
    this.masterOrdersSubscription$.unsubscribe();
    this.commercialProductCombo$.unsubscribe();
    this.viaComboSubscription$.unsubscribe();
    this.productComboSubscription$.unsubscribe();
    this.complementComboSubscription$.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.searchDay) {
      this.searchDay = new Date();
      this.updateFilters();
      this.routerSearch();
    }
    this.initColumns();
    this.updateFilters();
    this.routerSearch();
    this._selectedColumns = this.cols;
    this.loadMasterOrders();

    this.selectedSuccessMaster();
  }

  selectedSuccessMaster() {
    this.store
      .select(MasterOrderStoreSelectors.successCreateOrUpdate)
      .subscribe({
        next: (masterOrders) => {
          if (masterOrders) {
            this.loadMasterOrders();
            this.prepareDialogDetail = false;
            this.orderDetailDialog = false;
            this.orderDetailForm.reset();
            this.masterOrderForm = [];
            this.store.dispatch(
              MasterOrderStoreActions.selectSuccessCreateOrUpdateChange({
                payload: false,
              }),
            );
          }
        },
      });
  }

  loadMasterOrders() {
    this.store.dispatch(
      MasterOrderStoreActions.loadMasterOrder({
        payload: {
          searchDay: this.searchDay,
          searchIdentification: this.searchIdentification,
        },
      }),
    );
    this.masterOrdersSubscription$ = this.store
      .select(MasterOrderStoreSelectors.selectMasterOrders)
      .subscribe({
        next: (masterOrders) => {
          this.masterOrders = this.groupByPatientIdentification(masterOrders);
        },
      });
    this.updateFilters();
  }

  routerSearch() {
    this.route.queryParamMap.subscribe((params) => {
      const dateSearch = params.get('searchDay');
      const identificationSearch = params.get('searchIdentification');
      if (dateSearch) {
        this.searchDay = new Date(dateSearch);
      }
      if (identificationSearch) {
        this.searchIdentification = identificationSearch;
      }
    });
  }

  updateFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        searchDay: this.searchDay,
        searchIdentification: this.searchIdentification,
      },
      queryParamsHandling: 'merge',
    });
  }

  initColumns(): void {
    this.cols = [
      { field: 'patientIdentification', header: 'ID' },
      { field: 'patientRut', header: 'Rut' },
      { field: 'patientName', header: 'Nombre' },
      { field: 'patientLastName', header: 'Apellido' },
    ];

    this.subCols = [
      // { field: 'masterRecord', header: 'Id' },
      { field: 'cycleNumber', header: 'Ciclo' },
      { field: 'unitHospitalName', header: 'Un. Hosp' },
      { field: 'productionDate', header: 'Producción' },
      { field: 'diagnosisName', header: 'Diag' },
      { field: 'schemaName', header: 'Esquema' },
    ];

    this.detailTableCols = [
      { field: 'masterRecord', header: 'ID' },
      { field: 'via.description', header: 'Via' },
      { field: 'productCode', header: 'P. Code' },
      { field: 'productName', header: 'Prod.' },
      { field: 'quantity', header: 'Cant.' },
      { field: 'batch', header: 'Lote' },
      { field: 'complementName', header: 'Vol.' },
    ];
  }

  formatDate(time: number) {
    const date = new Date(time * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-4);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
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

  groupByPatientIdentification(data: any[]) {
    const groupedData = data.reduce((acc, item) => {
      const patientId = item.patientIdentification;
      if (!acc[patientId]) {
        acc[patientId] = {
          patientRut: item.patientRut,
          patientIdentification: patientId,
          patientName: item.patientName,
          patientLastName: item.patientLastName,
          isapreName: item.isapreName,
          details: [],
        };
      }
      acc[patientId].details.push({
        masterRecord: item.masterRecord,
        productionDate: item.productionDate,
        viaDescription: item.viaDescription,
        pharmaceuticalChemist: item.pharmaceuticalChemist,
        doctorName: item.doctorName,
        unitHospitalName: item.unitHospitalName,
        idDiagnosisOrder: item.diagnosisOrderStage.id,
        idMasterId: item.id,
        orderDetails: item.orderDetails || [],
        diagnosisName: item.diagnosisName,
        cycleNumber: item.cycleNumber,
        cycleDay: item.cycleDay,
        schemaName: item.schemaName,
        state: item.state,
      });
      return acc;
    }, {});
    return Object.values(groupedData);
  }

  searchMasterOrder() {
    this.loadMasterOrders();
  }

  initProcessManufacture(detail: any, master: any) {
    this.initCombo();
    this.currentTableSelectedDetail = detail;
    this.currentTableSelectedMaster = master;
    this.initFormOrderDetails();
    this.orderDetailDialog = true;
  }

  initCombo() {
    this.initComboProduct();
    this.initComboComplement();
    this.initViaCombo();
    this.initComboCommercialProduct();
    this.initComboUnitMetric();
    this.initConditionCombo();
  }

  initConditionCombo() {
    this.conditionCombo = [
      {
        code: 'Precaución citostático vesicante',
        name: 'Precaución citostático vesicante',
      },
      {
        code: 'Precaución citostático irritante',
        name: 'Precaución citostático irritante',
      },
      {
        code: 'Administrar con filtro de 0,45 mcm',
        name: 'Administrar con filtro de 0,45 mcm',
      },
      { code: 'Intratecal', name: 'Intratecal' },
    ];
  }

  initComboUnitMetric() {
    // ML, L, MG, KG, UN, UI, MCG
    this.unitMetricCombo = [
      { code: 'ML', name: 'ML' },
      { code: 'L', name: 'L' },
      { code: 'MG', name: 'MG' },
      { code: 'KG', name: 'KG' },
      { code: 'UN', name: 'UN' },
      { code: 'UI', name: 'UI' },
      { code: 'MCG', name: 'MCG' },
    ];
  }

  initComboProduct() {
    this.store.dispatch(ProductStoreActions.loadProduct());
    this.productComboSubscription$ = this.store
      .select(ProductStoreSelectors.selectProduct)
      .subscribe({
        next: (product) => {
          this.productCombo = product.map((p) => ({
            code: p.code,
            name: p.description,
          }));
        },
      });
  }

  initViaCombo() {
    this.store.dispatch(ViaStoreActions.loadVia());
    this.viaComboSubscription$ = this.store
      .select(ViaStoreSelectors.selectorViaCombo)
      .subscribe({
        next: (via) => {
          this.viaCombo = via;
        },
      });
  }

  initComboCommercialProduct() {
    this.store.dispatch(CommercialProductStoreActions.loadCommercialProducts());
    this.commercialProductCombo$ = this.store
      .select(CommercialProductStoreSelectors.selectCommercialProduct)
      .subscribe({
        next: (commercialProduct) => {
          this.commercialProductCombo = commercialProduct.map((c) => ({
            code: c.code,
            name: `${c.description} - ${c.laboratory}`,
          }));
        },
      });
  }

  initComboComplement() {
    this.store.dispatch(ComplementStoreActions.loadComplement());
    this.complementComboSubscription$ = this.store
      .select(ComplementStoreSelectors.selectComplement)
      .subscribe({
        next: (complement) => {
          this.complementCombo = complement.map((c) => ({
            code: c.code,
            name: c.description,
          }));
        },
      });
  }

  hideDialog() {
    this.orderDetailForm.reset();
    this.orderDetailDialog = false;
  }

  saveFormula() {
    const formValue = this.orderDetailForm.value;
    const masterOrder: MasterOrderFormResourceDto = {
      patientIdentification:
        this.currentTableSelectedMaster.patientIdentification,
      via: formValue.via.code,
      diagnosisOrder: this.currentTableSelectedDetail.idDiagnosisOrder,
      master: this.currentTableSelectedDetail.idMasterId,
      productionDate: formValue.productionDate,
      details: {
        productCode: formValue.productName.code,
        dose: formValue.dose,
        productionDate: formValue.productionDate,
        expirationDate: formValue.expirationDate,
        unitMetric: formValue.unitMetric.code,
        complementCode: formValue.complement.code,
        volTotal: formValue.volTotal,
        prot: formValue.prot,
        condition: formValue.condition.code,
        administrationTime: formValue.administrationTime,
        observation: formValue.observation,
        commercialPart: formValue.commercialPart.map((c: any) => ({
          commercial: c.commercial.code,
          batch: c.batch,
          part: c.part,
        })),
      },
    };
    this.masterOrderForm.push(masterOrder);
    this.store.dispatch(
      MasterOrderStoreActions.createMasterOrder({
        payload: this.masterOrderForm,
      }),
    );
  }

  detailProduct(detail: any, master: any) {
    this.masterDetailTable = detail.orderDetails;
    this.prepareDialogDetail = true;
  }

  formatDateTimeSeparated(inDate: any) {
    let timestamp;
    if (inDate instanceof Date) {
      timestamp = inDate.getTime() * 1000;
    } else {
      timestamp = inDate * 1000;
    }

    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}`;
    return {
      formattedDate,
      formattedTime,
    };
  }

  async previewLabel(detail: any, master: any) {
    this.zebraPreview = true;
    this.printDetail = {
      detail,
      master,
    };
    for (let i = 0; i < detail.orderDetails.length; i++) {
      const zpl = this.generateZpl(detail, i, master);
      setTimeout(async () => {
        try {
          const canvasId = `labelCanvas${i}`;
          const canvasContainer = document.getElementById('canvasContainer');
          const canvas = document.createElement('canvas');
          canvas.id = canvasId;
          canvasContainer?.appendChild(canvas);
          await this.zebraPrintService.previewLabel(zpl, canvasId);
        } catch (error) {
          console.error('Error previewing label:', error);
        }
      }, 0); // Ensure the modal is rendered before accessing the canvas
    }
  }

  private generateZpl(detail: any, i: number, master: any) {
    return `^XA
^PW1000
^LL1000
^CFA,20
^CI28
^FO420,10
^BCN,65,N,N
^FD14${detail.orderDetails[i].masterRecord}^FS
^FO390,80^GB360,50,3^FS
^FO400,90^A0N^FDCentral de Mezclas Estériles Oncológicas^FS
^FO500,110^FDFarmacia PROFAR^FS
^FO20,140^FDNom. Paciente:^FS
^FO190,140^FD${master.patientLastName}, ${master.patientName}^FS
^FO20,170^FDN° RUT:^FS
^FO110,170^FD${master.patientRut}^FS
^FO500,170^FDR.M.: ^FS
^FO560,170^FD${detail.orderDetails[i].masterRecord}^FS
^FO20,200^FDClínica:^FS
^FO114,200^FD${detail.unitHospitalName}^FS
^FO520,200^FDOrden:  ^FS
^FO590,200^FD${i + 1}/${detail.orderDetails.length}^FS
^FO20,230^FDEsquema:^FS
^FO114,230^FD${detail.schemaName},^FS
^FO320,230^FDCiclo:^FS
^FO400,230^FD${detail.cycleNumber}^FS
^FO20,260^FDDiagnóstico: ^FS
^FO165,260^FD${detail.diagnosisName}^FS
^FO20,290^GB750,3,3^FS
^FO20,320^FDDroga: ^FS
^FO114,320^FD${detail.orderDetails[i].productName} ${detail.orderDetails[i].quantity} ${detail.orderDetails[i].unitMetric}^FS
^FO20,350^FD${detail.orderDetails[i].complementName}^FS
^FO20,380^FDVol.Total:^FS
^FO150,380^FD${detail.orderDetails[i].volumeTotal} mL,^FS
^FO330,380^FDTiempo:  ^FS
^FO420,380^FD${detail.orderDetails[i].administrationTime}^FS
^FO20,410^FDVía adm.:^FS
^FO130,410^FD${detail.orderDetails[i].via.description} ^FS
^FO300,410^FDProteger Luz: ${detail.orderDetails[i].prot}^FS
^FO20,440^FDPrecaución: ^FS
^FO165,440^FD${detail.orderDetails[i].condition}^FS
^FO20,470^FD${detail.orderDetails[i].observation}^FS
^FO20,500^GB750,3,3^FS
^FO20,530^FDMédico Resp.: ^FS
^FO180,530^FD${detail.doctorName}^FS
^FO550,530^FDDía:^FS
^FO610,530^FD${detail.cycleDay}^FS
^FO20,560^FDFecha de Elab: ^FS
^FO200,560^FD${this.formatDateTimeSeparated(detail.orderDetails[i].productionDate).formattedDate}^FS
^FO360,560^FDHora de Elab: ^FS
^FO530,560^FD${this.formatDateTimeSeparated(detail.orderDetails[i].productionDate).formattedTime}^FS
^FO20,590^FDFecha Vencim.: ^FS
^FO200,590^FD${this.formatDateTimeSeparated(detail.orderDetails[i].expirationDate).formattedDate}^FS
^FO360,590^FDHora Vencim.: ^FS
^FO530,590^FD${this.formatDateTimeSeparated(detail.orderDetails[i].expirationDate).formattedTime}^FS
^FO20,620^FDLaborat:^FS
^FO120,620^FD${detail.orderDetails[i].commercialOrderDetails[0].laboratory}^FS
^FO550,620^FDLote:^FS
^FO610,620^FD${detail.orderDetails[i].commercialOrderDetails
      .map((part: any) => part.batch)
      .join('//')}^FS
^FO40,650^FDN° Registro: ^FS
^FO200,650^FDRF XIII 04/16;3D^FS
^FO450,650^FDDT.QF.^FS
^FO520,650^FDPamela Figari^FS
^FO5,680^FDPor seguridad eliminar este preparado después de fecha vencimiento^FS
^FO50,710^FDDirección: Pérez Valenzuela 1077, Providencia^FS
^FO20,740^GB750,3,3^FS
^XZ`;
  }

  async printEvent() {
    try {
      const printers = await this.zebraPrintService.getAvailablePrinters();
      console.log(printers);
      if (printers.length === 0) {
        console.error('No printers found');
        return;
      }
      this.zebraPrintService.setPrinter(printers[0]);
      for (let i = 0; i < this.printDetail.detail.orderDetails.length; i++) {
        const zpl = this.generateZpl(
          this.printDetail.detail,
          i,
          this.printDetail.master,
        );
        await this.zebraPrintService.print(zpl);
      }
    } catch (error) {
      console.error('Error during printing process:', error);
    }
  }
}
