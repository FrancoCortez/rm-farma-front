import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { MenuItem, PrimeNGConfig, PrimeTemplate } from 'primeng/api';
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
import {
  combineLatest,
  filter,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { MasterOrderStoreModule } from '../../../root-store/master-order-store';
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
import { MasterOrderDetailsUpdateFormResourceDto } from '../../../model/master-order-details/master-order-details-update-form-resource.dto';
import { OrderDetailsStoreModule } from '../../../root-store/order-details-store';
import { SpinnerComponent } from '../../../utils/components/spinner/spinner.component';
import { ModalSuccessComponent } from '../../../utils/components/modal-success/modal-success.component';
import { MasterOrderService } from '../../../services/master-order.service';
import { OrderDetailsService } from '../../../services/order-details.service';
import { ModalErrorComponent } from '../../../utils/components/modal-error/modal-error.component';
import { minLengthArray } from '../../../utils/form-validation/array-validator.form';
import { ListHistoryManufactureComponent } from '../list-history-manufacture/list-history-manufacture.component';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { CommercialProductService } from '../../../services/commercial-product.service';

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
    OrderDetailsStoreModule,
    NgIf,
    TagModule,
    SpinnerComponent,
    ModalSuccessComponent,
    ModalErrorComponent,
    ListHistoryManufactureComponent,
    SplitButtonModule,
    MenuModule,
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
  statusCombo: ComboModelDto[] = [];
  conditionCombo: ComboModelDto[] = [];
  operation: string = 'created';
  dialogTitle: string = 'Agregar Nueva Fórmula';
  displayOk: boolean = false;
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
  private masterRecordPath = '';
  isLoadingUpdate = false;
  displayError = false;
  messageError = '';
  copyDialog = false;
  copyValues: number[] = [];

  openHistory = false;
  historyIdentification!: { identification: string; diagnosisOrder: string };
  items!: MenuItem[];
  specialPatientIdentification = '616082043';

  lastQuantity = 1;
  get successMessage(): string {
    return this.lastQuantity > 1
      ? `Se han creado ${this.lastQuantity} preparados con éxito`
      : 'Se ha creado el preparado con éxito';
  }

  get isSpecialPatient(): boolean {
    const identification =
      this.operation === 'for_history'
        ? this.masterHistoryBackup?.patientIdentification
        : this.currentTableSelectedMaster?.patientIdentification;
    return identification === this.specialPatientIdentification;
  }

  get isPrintSpecialPatient(): boolean {
    return (
      this.printDetail?.master?.patientIdentification ===
      this.specialPatientIdentification
    );
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly store: Store<RootStoreState.RootState>,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private cdr: ChangeDetectorRef,
    private zebraPrintService: ZebraPrintService,
    private masterOrderService: MasterOrderService,
    private orderDetailService: OrderDetailsService,
    private commercialProductService: CommercialProductService,
  ) {}

  ngAfterViewInit() {
    this.primengConfig.ripple = true;
  }

  initFormOrderDetails(commercialPartsData: any[] = []) {
    let date = new Date();
    let expirationDate = new Date();
    if (this.operation === 'created') {
      date = new Date(this.currentTableSelectedDetail.productionDate);
      // expirationDate = new Date(this.currentTableSelectedDetail.productionDate);
    }
    // expirationDate.setDate(expirationDate.getDate() + 4);
    this.orderDetailForm = this.fb.group({
      via: ['', Validators.required],
      productionDate: [date, Validators.required],
      expirationDate: [null, Validators.required],
      productName: ['', Validators.required],
      dose: [null, Validators.required],
      bedDay: [null],
      unitMetric: ['', Validators.required],
      complement: ['', Validators.required],
      volTotal: [null, Validators.required],
      status: [''],
      prot: ['Proteger Luz y Refrigerar', Validators.required],
      administrationTime: [null, Validators.required],
      administrationDate: [null],
      condition: [''],
      observation: [''],
      concentration: [null, Validators.required],
      quantity: [
        1,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      commercialPart: this.fb.array([]),
    });

    commercialPartsData.forEach((data) => {
      this.commercialPart.push(this.createCommercialPart(data));
    });
  }

  createCommercialPart(data: any = {}): FormGroup {
    return this.fb.group({
      commercial: [data.commercial || '', Validators.required],
      batch: [data.batch || '', Validators.required],
      part: [data.part ?? null, [Validators.required, Validators.min(0)]],
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
    this.commercialPart.removeAt(index);
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

  getMenuItems(master: any, detail: any): MenuItem[] {
    return [
      {
        label: 'Agregar Fórmula',
        icon: 'pi pi-plus-circle',
        command: () => this.initProcessManufacture(detail, master),
      },
      {
        label: 'Detalle Fórmula',
        icon: 'pi pi-minus-circle',
        command: () => this.detailProduct(detail, master),
      },
      {
        label: 'Ver Histórico',
        icon: 'pi pi-history',
        command: () => this.initHistoryManufacture(detail, master),
      },
      { separator: true },
      {
        label: 'Imprimir Etiqueta',
        icon: 'pi pi-print',
        command: () => this.previewLabel(detail, master),
      },
    ];
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
    this.initCombo();
  }
  isManualConcentration = false;

  calculateConcentration() {
    const dose = this.orderDetailForm.get('dose')?.value;
    const via = this.orderDetailForm.get('via')?.value;
    const commercialPart = this.orderDetailForm.get('commercialPart')?.value;
    const dose$ = this.orderDetailForm
      .get('dose')
      ?.valueChanges.pipe(startWith(dose));
    const via$ = this.orderDetailForm
      .get('via')
      ?.valueChanges.pipe(startWith(via));
    const commercialPart$ = this.orderDetailForm
      .get('commercialPart')
      ?.valueChanges.pipe(startWith(commercialPart));
    if (dose$ && via$ && commercialPart$) {
      combineLatest([dose$, via$, commercialPart$]).subscribe(
        ([dose, via, commercialPart]) => {
          if (this.isManualConcentration) return;
          if (
            dose &&
            via &&
            commercialPart.length > 0 &&
            commercialPart[0]?.commercial
          ) {
            this.setConcentrationValue(dose, via, commercialPart);
          }
        },
      );
    }
  }
  setConcentrationValue(dose: any, via: any, commercialPart: any) {
    if (this.orderDetailForm.get('concentration')?.disabled) {
      this.orderDetailForm.get('concentration')?.enable({ emitEvent: false });
    }
    const concentration = commercialPart[0].commercial?.concentration;
    const concentrationUnit = commercialPart[0].commercial?.concentrationUnit;
    const defaultConcentration =
      commercialPart[0].commercial?.defaultConcentration;
    const viaCode = via.code;
    if (defaultConcentration) {
      this.orderDetailForm
        .get('concentration')
        ?.patchValue(defaultConcentration, { emitEvent: false });
    } else {
      if (concentration && concentrationUnit) {
        const concentrationValue = dose / concentration + ' ML';
        this.orderDetailForm
          .get('concentration')
          ?.patchValue(concentrationValue, { emitEvent: false });
      }
      if (
        !concentration &&
        !concentrationUnit &&
        commercialPart[0].commercial?.factors.length > 0
      ) {
        const factor = commercialPart[0].commercial.factors.find(
          (f: any) => f.administrationRoute === viaCode,
        );
        const concentrationValue = factor
          ? dose / factor.factor + ' ML'
          : dose / 1 + ' ML';
        this.orderDetailForm
          .get('concentration')
          ?.patchValue(concentrationValue, { emitEvent: false });
      }
    }
  }

  loadMasterOrders() {
    this.isLoadingUpdate = true;
    this.masterOrderService
      .findAllMasterOrders(this.searchDay, this.searchIdentification)
      .subscribe({
        next: (value) => {
          this.masterOrders = this.groupByPatientIdentification(value);
        },
        error: (err) => {},
        complete: () => {
          this.isLoadingUpdate = false;
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
      { field: 'status', header: 'Estado' },
      { field: 'via.description', header: 'Via' },
      { field: 'productCode', header: 'P. Code' },
      { field: 'productName', header: 'Prod.' },
      { field: 'quantity', header: 'Dosis.' },
      { field: 'batch', header: 'Lote' },
      { field: 'complementName', header: 'Vol.' },
    ];
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

  getSeverity(status: string) {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'SUSPENDED':
        return 'danger';
      default:
        return 'info';
    }
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
      if (field === 'quantity') {
        return acc.quantity + ' ' + acc.unitMetric;
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
        diagnosisOrder: item.diagnosisOrderStage.diagnosisPatient.id,
        viaDescription: item.viaDescription,
        pharmaceuticalChemist: item.pharmaceuticalChemist,
        administrationDate: item.administrationDate,
        bedDay: item.bedDay,
        doctorName: item.doctorName,
        unitHospitalName: item.unitHospitalName,
        idDiagnosisOrder: item.diagnosisOrderStage.id,
        serviceName:
          item.diagnosisOrderStage.diagnosisPatient?.services?.description,
        idMasterId: item.id,
        orderDetails: item.orderDetails || [],
        diagnosisName: item.diagnosisName,
        cycleNumber: item.cycleNumber,
        cycleDay: item.cycleDay,
        schemaName: item.schemaName,
        concentration: item.concentration,
        status: item.status,
        reasonForSuspension: item.reasonForSuspension,
      });
      return acc;
    }, {});
    return Object.values(groupedData);
  }

  searchMasterOrder() {
    this.loadMasterOrders();
  }

  initProcessManufacture(detail: any, master: any) {
    this.operation = 'created';
    this.dialogTitle = 'Agregar Nueva Fórmula';
    this.initCombo();
    this.currentTableSelectedDetail = detail;
    this.currentTableSelectedMaster = master;
    this.initFormOrderDetails();
    this.orderDetailDialog = true;
    setTimeout(() => {
      const input = document.getElementById('concentration');
      if (input) {
        input.addEventListener(
          'focus',
          () => (this.isManualConcentration = true),
        );
        input.addEventListener(
          'blur',
          () => (this.isManualConcentration = false),
        );
      }
    });
    this.calculateConcentration();
  }

  initCombo() {
    this.initComboProduct();
    this.initComboComplement();
    this.initViaCombo();
    // this.initComboCommercialProduct();
    this.initComboUnitMetric();
    this.initConditionCombo();
    this.initStatusCombo();
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
      { code: '96 horas a T° ambiente', name: '96 horas a T° ambiente' },
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

  initComboCommercialProduct(id: string) {
    // this.store.dispatch(CommercialProductStoreActions.loadCommercialProducts());
    // this.commercialProductCombo$ = this.store
    //   .select(CommercialProductStoreSelectors.selectCommercialProduct)
    //   .subscribe({
    //     next: (commercialProduct) => {
    //       this.commercialProductCombo = commercialProduct.map((c) => ({
    //         ...c,
    //         code: c.code,
    //         name: c.laboratory
    //           ? `${c.code} - ${c.description} - ${c.laboratory}`
    //           : `${c.code} - ${c.description}`,
    //       }));
    //     },
    //   });
    if (id) {
      this.commercialProductCombo$ = this.commercialProductService
        .findByProductId(id)
        .subscribe({
          next: (commercialProduct) => {
            this.commercialProductCombo = commercialProduct.map((c) => ({
              ...c,
              code: c.code,
              name: c.laboratory
                ? `${c.code} - ${c.description} - ${c.laboratory}`
                : `${c.code} - ${c.description}`,
            }));
          },
        });
    }
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
    this.masterHistoryBackup = {};
    this.detailHistoryBackup = {};
  }

  updateFormula() {
    const expirationHours = Number(
      new Date(this.orderDetailForm.value.expirationDate),
    );
    const patchFormula: MasterOrderDetailsUpdateFormResourceDto = {
      master: this.currentTableSelectedDetail.idMasterId,
      masterRecord: this.masterRecordPath,
      details: {
        productCode: this.orderDetailForm.value.productName?.code,
        via: this.orderDetailForm.value.via?.code,
        dose: this.orderDetailForm.value.dose,
        productionDate: this.orderDetailForm.value.productionDate,
        administrationDate: this.orderDetailForm.value.administrationDate,
        bedDay: this.orderDetailForm.value.bedDay,
        expirationDate: new Date(
          this.orderDetailForm.value.productionDate.getTime() +
            expirationHours * 60 * 60 * 1000,
        ),
        unitMetric: this.orderDetailForm.value.unitMetric?.code,
        complementCode: this.orderDetailForm.value.complement?.code,
        volTotal: this.orderDetailForm.value.volTotal,
        prot: this.orderDetailForm.value.prot,
        condition: this.orderDetailForm.value.condition?.code,
        administrationTime: this.orderDetailForm.value.administrationTime,
        concentration: this.orderDetailForm?.value?.concentration,
        observation: this.orderDetailForm.value.observation,
        status: this.orderDetailForm.value.status,
        commercialPart: this.orderDetailForm.value.commercialPart.map(
          (c: any) => ({
            commercial: c.commercial?.code,
            batch: c.batch,
            part: c.part,
          }),
        ),
      },
    };
    this.orderDetailService.updateDetail(patchFormula).subscribe({
      next: (value) => {
        this.prepareDialogDetail = false;
        this.orderDetailDialog = false;
        this.orderDetailForm.reset();
        this.masterOrderForm = [];
        this.displayOk = true;
      },
      error: (err) => {
        this.displayError = true;
        console.log(err);
      },
      complete: () => {
        this.isLoadingUpdate = false;
      },
    });
  }

  detailProduct(detail: any, master: any) {
    this.masterDetailTable = detail.orderDetails;
    this.currentTableSelectedDetail = detail;
    this.currentTableSelectedMaster = master;
    this.prepareDialogDetail = true;
  }

  formatDateTimeSeparated(inDate: any) {
    let date;
    if (inDate instanceof Date) {
      date = inDate;
    } else if (
      (typeof inDate === 'number' && !isNaN(inDate)) ||
      typeof inDate === 'string'
    ) {
      date = new Date(inDate);
    } else {
      return {
        formattedDate: 'Error',
        formattedTime: 'N/A',
      };
    }
    if (isNaN(date.getTime())) {
      return {
        formattedDate: 'Inválida',
        formattedTime: 'Inválida',
      };
    }

    // 2. Extracción y Formato (tu lógica original)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque enero es 0
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

  private getPreviewIndices(detail: any, isSpecial: boolean): number[] {
    const total = detail?.orderDetails?.length ?? 0;
    if (total === 0) {
      return [];
    }
    if (!isSpecial || total <= 2) {
      return Array.from({ length: total }, (_, i) => i);
    }
    const ordered = detail.orderDetails
      .map((d: any, idx: number) => ({
        idx,
        key: this.getNumericSortKey(d.masterRecord),
      }))
      .sort(
        (a: { idx: number; key: number }, b: { idx: number; key: number }) =>
          a.key - b.key,
      );
    const firstIdx = ordered[0].idx;
    const lastIdx = ordered[ordered.length - 1].idx;
    return firstIdx === lastIdx ? [firstIdx] : [firstIdx, lastIdx];
  }

  private getNumericSortKey(masterRecord: any): number {
    if (masterRecord == null) return Number.POSITIVE_INFINITY;
    const match = String(masterRecord).match(/-?\d+/);
    return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
  }

  private getOrderLabel(detail: any, i: number): string {
    const total = detail?.orderDetails?.length ?? 0;
    if (total === 0) {
      return '0/0';
    }
    const orderedIndices = detail.orderDetails
      .map((_: any, idx: number) => idx)
      .sort(
        (a: number, b: number) =>
          this.getNumericSortKey(detail.orderDetails[a].masterRecord) -
          this.getNumericSortKey(detail.orderDetails[b].masterRecord),
      );
    const position = orderedIndices.indexOf(i) + 1;
    return `${position}/${total}`;
  }

  async previewLabel(detail: any, master: any) {
    this.isLoadingUpdate = true;
    this.zebraPreview = true;
    this.printDetail = {
      detail,
      master,
    };
    setTimeout(async () => {
      try {
        const headZpl = this.generateHeadZpl(detail, master);
        const canvasContainer = document.getElementById('canvasContainer');
        const headCanvasId = 'labelHeadCanvas';
        const headCanvas = document.createElement('canvas');
        headCanvas.id = headCanvasId;
        canvasContainer?.appendChild(headCanvas);
        await this.zebraPrintService.previewLabel(headZpl, headCanvasId);

        const isSpecial =
          master?.patientIdentification === this.specialPatientIdentification;
        const indices = this.getPreviewIndices(detail, isSpecial);

        for (const i of indices) {
          if (detail.orderDetails[i].status === 'ACTIVE') {
            const zpl = this.generateZplDetail(detail, i, master);
            const canvasId = `labelCanvas${i}`;
            const canvas = document.createElement('canvas');
            canvas.id = canvasId;
            canvasContainer?.appendChild(canvas);
            await this.zebraPrintService.previewLabel(zpl, canvasId);
          }
        }
      } catch (error) {
        console.error('Error previewing label:', error);
      } finally {
        this.isLoadingUpdate = false;
      }
    }, 0); // Ensure the modal is rendered before accessing the canvas
  }

  private generateHeadZpl(detail: any, master: any) {
    return `^XA
^CI28
^CF0,35
^FO20,250^GB750,170,8^FS
^BY5,2,270
^FO35,290^FD${master.patientLastName}, ${master.patientName}^FS
^FO35,360^FDN°H.C: ^FS
^FO180,360^FD${master.patientRut}^FS
^CF0,35
^FO30,440^A0N,50,35^FDFecha:^FS
^FO230,440^A0N,50,30^FD${this.formatDateTimeSeparated(detail.orderDetails[0].productionDate).formattedDate}^FS
^FO30,510^A0N,50,35^FDServicio:^FS
^FO230,510^A0N,50,30^FD${detail.serviceName}^FS
^FO30,580^A0N,50,35^FDUd Hosp:^FS
^FO230,580^A0N,50,30^FD${detail.unitHospitalName}^FS
^FO30,650^A0N,50,35^FDEsquema:^FS
^FO230,650^A0N,50,30^FD${detail.schemaName}, Ciclo: ${detail.cycleNumber}^FS
^FO30,720^A0N,50,35^FDMédico Resp:^FS
^FO230,720^A0N,50,30^FD${detail.doctorName}^FS
^XZ
`;
  }

  private generateZplDetail(detail: any, i: number, master: any) {
    const laboratory =
      detail.orderDetails[i].commercialOrderDetails[0]?.laboratory || 'N/A';
    const truncatedLab =
      laboratory.length > 33 ? laboratory.substring(0, 33) + '...' : laboratory;
    let doseForCeroOne = `^FO114,320^A0N^FD${detail.orderDetails[i].productName} ${detail.orderDetails[i].quantity} ${detail.orderDetails[i].unitMetric}^FS`;
    let doseForCeroTwo = `^FO115,321^A0N^FD${detail.orderDetails[i].productName} ${detail.orderDetails[i].quantity} ${detail.orderDetails[i].unitMetric}^FS`;
    if (detail.orderDetails[i].quantity === 0) {
      doseForCeroOne = `^FO114,320^A0N^FD${detail.orderDetails[i].productName} ^FS`;
      doseForCeroTwo = `^FO115,321^A0N^FD${detail.orderDetails[i].productName} ^FS`;
    }
    return `^XA
^PW1000
^LL1000
^LH10,0
^CFA,20
^CI28
^FO20,20^A0N,20,20^FDPREPARADO CITOSTÁTICO^FS
^FO50,60^A0N,20,20^FDPRODUCTO ESTÉRIL^FS
^FO420,15
^BCN,65,N,N
^FD14${detail.orderDetails[i].masterRecord}^FS
^FO390,80^GB360,50,3^FS
^FO400,90^A0N^FDCentral de Mezclas Estériles Oncológicas^FS
^FO410,110^FDClínica BUPA Santiago S.A.^FS
^CFQ,25,22^AN
^FO20,140^FDNom. Paciente:^FS
^FO190,140^AN^FD${master.patientLastName}, ${master.patientName}^FS
^FO20,170^AN^FDN° RUT:^FS
^FO110,170^AN^FD${master.patientRut}^FS
^FO540,170^AN^FDR.M.: ^FS
^FO600,170^AN^FD${detail.orderDetails[i].masterRecord}^FS
^FO20,200^AN^FDInstitución:^FS
^FO161,200^AN^FD${detail.serviceName}^FS
^FO540,200^AN^FDOrden:  ^FS
^FO610,200^AN^FD${this.getOrderLabel(detail, i)}^FS
^FO20,230^AN^FDEsquema:^FS
^FO125,230^AN^FD${detail.schemaName},^FS
^FO540,230^AN^FDCiclo:^FS
^FO610,230^AN^FD${detail.cycleNumber}^FS
^FO20,260^AN^FDDiagnóstico: ^FS
^FO165,260^AN^FD${detail.diagnosisName}^FS
^FO540,260^AN^FDCama: ^FS
^FO610,260^AN^FD${detail.orderDetails[i].bedDay}^FS
^FO20,290^GB750,3,3^FS
^FO20,320^A0N^FDDroga: ^FS
^FO21,321^A0N^FDDroga: ^FS
${doseForCeroOne}
${doseForCeroTwo}
^FO20,350^A0N^FD${detail.orderDetails[i].complementName}^FS
^FO21,351^A0N^FD${detail.orderDetails[i].complementName}^FS
^FO20,380^A0N^FDVol.Total:^FS
^FO21,381^A0N^FDVol.Total:^FS
^FO150,380^A0N^FD${detail.orderDetails[i].volumeTotal} mL,^FS
^FO151,381^A0N^FD${detail.orderDetails[i].volumeTotal} mL,^FS
^FO380,380^AN^FDTiempo:  ^FS
^FO470,380^AN^FD${detail.orderDetails[i].administrationTime}^FS
^FO20,410^AN^FDVía adm.:^FS
^FO130,410^AN^FD${detail.orderDetails[i].via.description} ^FS
^FO380,410^AN^FD${detail.orderDetails[i].prot}^FS
^FO20,440^AN^FDPrecaución: ^FS
^FO165,440^AN^FD${detail.orderDetails[i].condition || 'Sin Observación'}^FS
^FO20,470^AN^FD${detail.orderDetails[i].observation || ''}^FS
^FO20,500^AN^FDFecha Administración: ^FS
^FO250,500^AN^FD${detail.orderDetails[i].administrationDate ? this.formatDateTimeSeparated(detail.orderDetails[i].administrationDate).formattedDate : 'N/A'}^FS
^FO20,520^GB750,3,3^FS
^FO20,530^AN^FDMédico Resp.: ^FS
^FO180,530^AN^FD${detail.doctorName}^FS
^FO550,530^AN^FDDía:^FS
^FO610,530^AN^FD${detail.cycleDay}^FS
^FO20,560^AN^FDFecha de Elab: ^FS
^FO200,560^AN^FD${this.formatDateTimeSeparated(detail.orderDetails[i].productionDate).formattedDate}^FS
^FO360,560^AN^FDHora de Elab: ^FS
^FO530,560^AN^FD${this.formatDateTimeSeparated(detail.orderDetails[i].productionDate).formattedTime}^FS
^FO20,590^AN^FDFecha Vencim.: ^FS
^FO200,590^AN^FD${this.formatDateTimeSeparated(detail.orderDetails[i].expirationDate).formattedDate}^FS
^FO360,590^AN^FDHora Vencim.: ^FS
^FO530,590^AN^FD${this.formatDateTimeSeparated(detail.orderDetails[i].expirationDate).formattedTime}^FS
^FO20,620^AN^FDLaborat:^FS
^FO120,620^AN^FD${truncatedLab}^FS
^FO510,620^AN^FDLote: ${detail.orderDetails[i].commercialOrderDetails.map((part: any) => part.batch).join('//')}^FS
^FO40,650^AN^FDN° Registro: ^FS
^FO200,650^AN^FDRF XIII 01/24:3B,3D^FS
^FO450,650^AN^FDDT.QF.^FS
^FO520,650^AN^FDAlicia González Yévenes^FS
^FO20,680^A0N,23^FDPor seguridad eliminar este preparado después de fecha vencimiento^FS
^FO21,681^A0N,23^FDPor seguridad eliminar este preparado después de fecha vencimiento^FS
^FO50,710^AN^FDDirección: Av Departamental N°1455 (Piso -1), La Florida^FS
^FO20,740^GB750,3,3^FS
^XZ`;
  }
  //
  // ^FO550,620^AN^FDLote:^FS
  // ^FO610,620^AN^FD${detail.orderDetails[i].commercialOrderDetails
  // .map((part: any) => part.batch)
  // .join('//')}^FS

  headCount = 0;
  bulkCopies = 1;
  openCopyDialog() {
    const lengthDetails = this.printDetail?.detail?.orderDetails?.length;
    if (lengthDetails) {
      this.copyValues = Array.from({ length: lengthDetails }, () => 1);
    }
    this.bulkCopies = 1;
    this.copyDialog = true;
  }

  // async printEvent() {
  //   this.isLoadingUpdate = true;
  //   try {
  //     const printers = await this.zebraPrintService.getAvailablePrinters();
  //     if (printers.length === 0) {
  //       console.error('No printers found');
  //       return;
  //     }
  //     this.zebraPrintService.setPrinter(printers[0]);
  //     if (this.headCount > 0) {
  //       const headZpl = this.generateHeadZpl(
  //         this.printDetail.detail,
  //         this.printDetail.master,
  //       );
  //       await this.zebraPrintService.print(headZpl);
  //     }
  //     for (let i = 0; i < this.printDetail.detail.orderDetails.length; i++) {
  //       const zpl = this.generateZplDetail(
  //         this.printDetail.detail,
  //         i,
  //         this.printDetail.master,
  //       );
  //       const copies = this.copyValues[i] || 1;
  //       for (let f = 0; f < copies; f++) {
  //         await this.zebraPrintService.print(zpl);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error during printing process:', error);
  //   } finally {
  //     this.isLoadingUpdate = false;
  //     this.copyDialog = false;
  //     this.zebraPreview = false;
  //   }
  // }
  async printEvent() {
    this.isLoadingUpdate = true;
    try {
      const printers = await this.zebraPrintService.getAvailablePrinters();
      if (printers.length === 0) {
        console.error('No printers found');
        return;
      }

      this.zebraPrintService.setPrinter(printers[0]);

      if (this.headCount > 0) {
        const headZpl = this.generateHeadZpl(
          this.printDetail.detail,
          this.printDetail.master,
        );
        await this.zebraPrintService.print(headZpl);
      }

      const isSpecial =
        this.printDetail?.master?.patientIdentification ===
        this.specialPatientIdentification;
      const bulkCopies = Number(this.bulkCopies);
      const useBulk =
        isSpecial && Number.isFinite(bulkCopies) && bulkCopies > 0;

      for (let i = 0; i < this.printDetail.detail.orderDetails.length; i++) {
        const copies = useBulk ? bulkCopies : Number(this.copyValues[i]);

        if (!Number.isFinite(copies) || copies <= 0) {
          continue;
        }

        const zpl = this.generateZplDetail(
          this.printDetail.detail,
          i,
          this.printDetail.master,
        );

        for (let f = 0; f < copies; f++) {
          await this.zebraPrintService.print(zpl);
        }
      }
    } catch (error) {
      console.error('Error during printing process:', error);
    } finally {
      this.isLoadingUpdate = false;
      this.copyDialog = false;
      this.zebraPreview = false;
    }
  }

  editProductionProcess(details: any, operation: string) {
    // console.log(details.productCode);F
    // this.operation = operation;
    // this.dialogTitle = 'Editar Fórmula ' + details?.masterRecord;
    // if (operation === 'for_history') {
    //   this.dialogTitle = 'Crear en base al histórico ' + details?.masterRecord;
    // }
    // this.masterRecordPath = details?.masterRecord;
    // const commercial = details.commercialOrderDetails.map((part: any) => ({
    //   commercial: this.commercialProductCombo.find((f) => f.code === part.code),
    //   batch: part.batch,
    //   part: part.quantity,
    // }));
    // this.initFormOrderDetails(commercial);
    // if (operation === 'for_history') {
    //   details.productionDate = new Date(
    //     this.detailHistoryBackup.productionDate,
    //   );
    //   details.expirationDate = null;
    //   details.administrationDate = null;
    // }
    // let diffHours = null;
    // if (details.expirationDate) {
    //   const productionDate = new Date(details.productionDate);
    //   const expirationDate = new Date(details.expirationDate);
    //   const diffSeconds = expirationDate.getTime() - productionDate.getTime();
    //   diffHours = diffSeconds / 3600 / 1000; // 3600 segundos en una hora
    // }
    // this.orderDetailForm.patchValue({
    //   via: details.via,
    //   productionDate: new Date(details.productionDate),
    //   administrationDate: details.administrationDate
    //     ? new Date(details.administrationDate)
    //     : null,
    //   expirationDate: diffHours,
    //   productName: this.productCombo.find(
    //     (f) => f.name === details.productName,
    //   ),
    //   dose: details.quantity,
    //   unitMetric: this.unitMetricCombo.find(
    //     (f) => f.name === details.unitMetric,
    //   ),
    //   bedDay: details.bedDay,
    //   complement: this.complementCombo.find(
    //     (f) => f.name === details.complementName,
    //   ),
    //   volTotal: details.volumeTotal,
    //   prot: details.prot,
    //   concentration: details.concentration,
    //   status: details.status,
    //   condition: this.conditionCombo.find((f) => f.name === details.condition),
    //   administrationTime: details.administrationTime,
    //   observation: details.observation,
    // });
    // if (this.orderDetailForm.get('concentration')?.disabled) {
    //   this.orderDetailForm.get('concentration')?.enable({ emitEvent: false });
    // }
    //
    // this.orderDetailDialog = true;
    // setTimeout(() => {
    //   const input = document.getElementById('concentration');
    //   if (input) {
    //     input.addEventListener(
    //       'focus',
    //       () => (this.isManualConcentration = true),
    //     );
    //     input.addEventListener(
    //       'blur',
    //       () => (this.isManualConcentration = false),
    //     );
    //   }
    // });
    // this.calculateConcentration();
    this.operation = operation;
    this.dialogTitle =
      operation === 'for_history'
        ? 'Crear en base al histórico ' + details?.masterRecord
        : 'Editar Fórmula ' + details?.masterRecord;
    this.masterRecordPath = details?.masterRecord;

    const applyDataAndOpen = (commercialList: any[]) => {
      // 1. Llenar el combo con la data que llegó del servidor
      this.commercialProductCombo = commercialList.map((c) => ({
        ...c,
        code: c.code,
        name: c.laboratory
          ? `${c.code} - ${c.description} - ${c.laboratory}`
          : `${c.code} - ${c.description}`,
      }));

      // 2. Ahora que el combo tiene data, mapear los comerciales del detalle
      const commercial = details.commercialOrderDetails.map((part: any) => ({
        commercial: this.commercialProductCombo.find(
          (f) => f.code === part.code,
        ),
        batch: part.batch,
        part: part.quantity,
      }));

      // 3. Inicializar el form con los comerciales ya mapeados
      this.initFormOrderDetails(commercial);

      // 4. Ajustes para for_history
      if (operation === 'for_history') {
        details.productionDate = new Date(
          this.detailHistoryBackup.productionDate,
        );
        details.expirationDate = null;
        details.administrationDate = null;
      }

      // 5. Calcular diffHours entre producción y vencimiento
      let diffHours = null;
      if (details.expirationDate) {
        const productionDate = new Date(details.productionDate);
        const expirationDate = new Date(details.expirationDate);
        const diffSeconds = expirationDate.getTime() - productionDate.getTime();
        diffHours = diffSeconds / 3600 / 1000;
      }

      // 6. PatchValue con el combo ya cargado — el find() ahora sí encuentra valores
      this.orderDetailForm.patchValue({
        via: details.via,
        productionDate: new Date(details.productionDate),
        administrationDate: details.administrationDate
          ? new Date(details.administrationDate)
          : null,
        expirationDate: diffHours,
        productName: this.productCombo.find(
          (f) => f.name === details.productName,
        ),
        dose: details.quantity,
        unitMetric: this.unitMetricCombo.find(
          (f) => f.name === details.unitMetric,
        ),
        bedDay: details.bedDay,
        complement: this.complementCombo.find(
          (f) => f.name === details.complementName,
        ),
        volTotal: details.volumeTotal,
        prot: details.prot,
        concentration: details.concentration,
        status: details.status,
        condition: this.conditionCombo.find(
          (f) => f.name === details.condition,
        ),
        administrationTime: details.administrationTime,
        observation: details.observation,
      });

      if (this.orderDetailForm.get('concentration')?.disabled) {
        this.orderDetailForm.get('concentration')?.enable({ emitEvent: false });
      }

      // 7. Abrir modal y registrar listeners de concentración
      this.orderDetailDialog = true;
      setTimeout(() => {
        const input = document.getElementById('concentration');
        if (input) {
          input.addEventListener(
            'focus',
            () => (this.isManualConcentration = true),
          );
          input.addEventListener(
            'blur',
            () => (this.isManualConcentration = false),
          );
        }
      });
      this.calculateConcentration();
    };

    // Si hay productCode → primero cargar el combo, luego aplicar y abrir
    if (details.productCode) {
      this.isLoadingUpdate = true;
      this.commercialProductService
        .findByProductId(details.productCode)
        .subscribe({
          next: (commercialList) => {
            applyDataAndOpen(commercialList);
          },
          error: () => {
            // Si falla la carga del combo, abre igual con combo vacío
            applyDataAndOpen([]);
          },
          complete: () => {
            this.isLoadingUpdate = false;
          },
        });
    } else {
      // Sin productCode → abre directamente con combo vacío
      applyDataAndOpen([]);
    }
  }

  confirmDialog($event: boolean) {
    this.loadMasterOrders();
    this.displayOk = $event;
  }

  confirmDialogError($event: boolean) {
    this.displayError = false;
  }

  masterHistoryBackup!: any;
  detailHistoryBackup!: any;
  statusModal = false;
  reasonForSuspension = '';
  statusOrder: any = null;

  initHistoryManufacture(detail: any, master: any) {
    this.masterHistoryBackup = master;
    this.detailHistoryBackup = detail;
    this.historyIdentification = {
      identification: master.patientIdentification,
      diagnosisOrder: detail.diagnosisOrder,
    };
    this.openHistory = true;
  }

  dialogHistoryClose($event: boolean) {
    this.openHistory = !$event;
    // this.detailHistoryBackup = {};
    // this.masterHistoryBackup = {};
  }

  createFormula() {
    this.isLoadingUpdate = true;
    this.lastQuantity = this.isSpecialPatient
      ? (this.orderDetailForm.value.quantity ?? 1)
      : 1;
    this.masterOrderForm = [this.buildMasterOrderFromForm()];
    this.masterOrderService.createMasterOrder(this.masterOrderForm).subscribe({
      next: () => {
        this.prepareDialogDetail = false;
        this.orderDetailDialog = false;
        this.orderDetailForm.reset();
        this.masterOrderForm = [];
        this.displayOk = true;
      },
      error: () => {
        this.messageError = 'No se logro crear la fórmula';
        this.displayError = true;
      },
      complete: () => {
        this.isLoadingUpdate = false;
      },
    });
  }

  createFormulaFromHistory() {
    this.createFormula();
  }

  private buildMasterOrderFromForm(): MasterOrderFormResourceDto {
    const formValue = this.orderDetailForm.value;
    const expirationHours = Number(formValue.expirationDate);
    const productionDate: Date = formValue.productionDate;
    const isHistory = this.operation === 'for_history';
    const master = isHistory
      ? this.detailHistoryBackup
      : this.currentTableSelectedDetail;
    const identification = isHistory
      ? this.masterHistoryBackup.patientIdentification
      : this.currentTableSelectedMaster.patientIdentification;

    return {
      patientIdentification: identification,
      via: formValue.via.code,
      diagnosisOrder: master.idDiagnosisOrder,
      master: master.idMasterId,
      productionDate,
      quantity: this.isSpecialPatient ? formValue.quantity : 1,
      details: {
        productCode: formValue.productName.code,
        dose: formValue.dose,
        productionDate,
        administrationDate: formValue.administrationDate,
        bedDay: formValue.bedDay,
        expirationDate: new Date(
          productionDate.getTime() + expirationHours * 60 * 60 * 1000,
        ),
        unitMetric: formValue.unitMetric.code,
        complementCode: formValue.complement.code,
        volTotal: formValue.volTotal,
        prot: formValue.prot,
        condition: formValue?.condition?.code,
        administrationTime: formValue.administrationTime,
        observation: formValue.observation,
        status: isHistory ? formValue.status : '',
        concentration: formValue?.concentration,
        commercialPart: formValue.commercialPart.map((c: any) => ({
          commercial: c.commercial.code,
          batch: c.batch,
          part: c.part,
        })),
      },
    };
  }

  saveFormula() {
    this.isLoadingUpdate = true;
    if (this.operation == 'created') {
      this.createFormula();
    }
    if (this.operation == 'updated') {
      this.updateFormula();
    }
    if (this.operation == 'for_history') {
      this.createFormulaFromHistory();
    }
  }

  historyUsed(masterUsed: any) {
    this.operation = 'for_history';
    this.editProductionProcess(masterUsed.orderDetails[0], 'for_history');
  }

  masterRecordChangeStatus = '';
  previewStatusOrder = '';

  protected editStatusOrder(master: any) {
    this.masterRecordChangeStatus = master.id;
    this.statusOrder = this.statusCombo.find((f) => f.code === master.status);
    this.reasonForSuspension = master.reasonForSuspension || '';
    this.previewStatusOrder = this.statusOrder.code;
    this.statusModal = true;
  }

  private initStatusCombo() {
    this.statusCombo = [
      { code: 'ACTIVE', name: 'ACTIVE' },
      { code: 'PENDING', name: 'PENDING' },
      { code: 'SUSPENDED', name: 'SUSPENDED' },
    ];
  }

  protected changeStatus() {
    this.isLoadingUpdate = true;
    if (
      this.previewStatusOrder === 'PENDING' &&
      this.statusOrder.code === 'ACTIVE'
    ) {
      this.messageError =
        'No se puede cambiar de PENDING a ACTIVE ya que le falta crear Producto Comercial';
      this.displayError = true;
      this.isLoadingUpdate = false;
      this.statusModal = false;
      this.prepareDialogDetail = false;
      return;
    }
    this.orderDetailService
      .changeStatus(
        this.masterRecordChangeStatus,
        this.statusOrder.code,
        this.reasonForSuspension,
      )
      .subscribe({
        next: (value) => {
          this.statusModal = false;
          this.prepareDialogDetail = false;
          this.displayOk = true;
          this.reasonForSuspension = '';
        },
        error: (err) => {
          this.messageError = 'No se logró cambiar el estado del preparado';
          this.displayError = true;
        },
        complete: () => {
          this.isLoadingUpdate = false;
          this.loadMasterOrders();
        },
      });
  }

  protected prepareMenu($event: Event, master: any, detail: any, menu: any) {
    this.items = this.getMenuItems(master, detail);
    menu.toggle($event);
  }

  selectCommercialProduct($event: any) {
    this.initComboCommercialProduct($event?.value?.code);
  }

  protected hideModalTableDetail() {
    this.currentTableSelectedDetail = {};
    this.currentTableSelectedMaster = {};
  }
}
