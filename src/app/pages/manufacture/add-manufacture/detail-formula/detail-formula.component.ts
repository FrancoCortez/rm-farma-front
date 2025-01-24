import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MasterOrderDetailsResourceDto } from '../../../../model/master-order-details/master-order-details-resource.dto';
import { NgForOf, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ColumModelDto } from '../../../../utils/models/colum-model.dto';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { FormValidationMessagesComponent } from '../../../../utils/components/form-validation-messages/form-validation-messages.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormControlStatusDirective } from '../../../../utils/directives/form-control-status.directive';
import { DropdownModule } from 'primeng/dropdown';
import { ComboModelDto } from '../../../../utils/models/combo-model.dto';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState } from '../../../../root-store';
import {
  ProductStoreActions,
  ProductStoreModule,
  ProductStoreSelectors,
} from '../../../../root-store/product-store';
import {
  ComplementStoreActions,
  ComplementStoreModule,
  ComplementStoreSelectors,
} from '../../../../root-store/complement-store';
import {
  ViaStoreActions,
  ViaStoreModule,
  ViaStoreSelectors,
} from '../../../../root-store/via-store';
import { MasterOrderFormResourceDto } from '../../../../model/master-order/master-order-form-resource.dto';
import {
  MasterOrderStoreActions,
  MasterOrderStoreModule,
} from '../../../../root-store/master-order-store';
import { CalendarModule } from 'primeng/calendar';
import { LocalStorageService } from '../../../../services/local-storage.service';

@Component({
  selector: 'app-detail-formula',
  standalone: true,
  imports: [
    TableModule,
    InputTextModule,
    FormsModule,
    ToolbarModule,
    NgForOf,
    ButtonDirective,
    Ripple,
    DialogModule,
    ReactiveFormsModule,
    InputNumberModule,
    InputTextareaModule,
    FormValidationMessagesComponent,
    FormControlStatusDirective,
    DropdownModule,
    ProductStoreModule,
    ComplementStoreModule,
    ViaStoreModule,
    MasterOrderStoreModule,
    CalendarModule,
    NgIf,
  ],
  templateUrl: './detail-formula.component.html',
})
export class DetailFormulaComponent implements OnInit, OnDestroy {
  @Input() identificationPatient!: string;
  orderDetails: MasterOrderDetailsResourceDto[] = [];
  masterOrderForm: MasterOrderFormResourceDto[] = [];
  cols: ColumModelDto[] = [];

  productCombo: ComboModelDto[] = [];
  complementCombo: ComboModelDto[] = [];
  viaCombo: ComboModelDto[] = [];

  orderDetailForm!: FormGroup;

  orderDetailDialog = true;

  productComboSubscription$: Subscription = new Subscription();
  complementComboSubscription$: Subscription = new Subscription();
  viaComboSubscription$: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private readonly store: Store<RootStoreState.RootState>,
    private readonly localStorageService: LocalStorageService,
  ) {}

  initCombo() {
    this.initComboProduct();
    this.initComboComplement();
    this.initViaCombo();
  }

  initData() {
    this.orderDetails =
      this.localStorageService.readLocalStorage<
        MasterOrderDetailsResourceDto[]
      >('masterOrderDetails') || [];
  }

  initComboProduct() {
    this.store.dispatch(ProductStoreActions.loadProduct());
    this.productComboSubscription$ = this.store
      .select(ProductStoreSelectors.selectProduct)
      .subscribe({
        next: (product) => {
          this.productCombo = product.map((p) => ({
            code: p.code,
            name: p.description + '-' + p.laboratory,
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

  initFormOrderDetails() {
    this.orderDetailForm = this.fb.group({
      via: ['', Validators.required],
      productionDate: [new Date(), Validators.required],
      productName: ['', Validators.required],
      realPart: [null, Validators.required],
      batch: ['', Validators.required],
      complement: ['', Validators.required],
      realPartComplement: [null, Validators.required],
      observation: [''],
    });
  }

  ngOnDestroy(): void {
    this.productComboSubscription$.unsubscribe();
    this.complementComboSubscription$.unsubscribe();
    this.viaComboSubscription$.unsubscribe();
  }

  ngOnInit(): void {
    this.initColumns();
    this.initCombo();
    this.initFormOrderDetails();
    this.initData();
  }

  initColumns(): void {
    this.cols = [
      { field: 'productCode', header: 'Cod. Pres' },
      { field: 'productName', header: 'Des. Pres' },
      { field: 'parting', header: 'Cant' },
      { field: 'realPart', header: 'Cant. Real' },
      { field: 'batch', header: 'Lote' },
      { field: 'observation', header: 'Observaciones' },
    ];
  }

  parseFieldInData(data: any, field: string) {
    // if (field === 'fullNameDoctor') {
    //   return `${data.doctor.name} ${data.doctor.lastName}`;
    // }
    return field.includes('.')
      ? field.split('.').reduce((acc: any, obj: any) => acc[obj], data)
      : data[field];
  }

  hideDialog() {
    this.orderDetailDialog = false;
    this.resetOrderDetailForm();
  }

  saveFormula() {
    // const masterOrder: MasterOrderFormResourceDto = {
    //   patientIdentification: this.identificationPatient,
    //   via: this.orderDetailForm.value.via.code,
    //   productionDate: this.orderDetailForm.value.productionDate,
    //   details: {
    //     productCode: this.orderDetailForm.value.productName.code,
    //     realPart: this.orderDetailForm.value.realPart,
    //     complementCode: this.orderDetailForm.value.complement.code,
    //     // realPartComplement: this.orderDetailForm.value.realPartComplement,
    //     batch: this.orderDetailForm.value.batch,
    //     observation: this.orderDetailForm.value.observation,
    //   },
    // };
    // this.masterOrderForm.push(masterOrder);
    // this.localStorageService.saveLocalStorage(
    //   'masterOrderForm',
    //   this.masterOrderForm,
    // );
    // const masterOrderDetails: MasterOrderDetailsResourceDto = {
    //   productCode: this.orderDetailForm.value.productName.code,
    //   productName: this.orderDetailForm.value.productName.name,
    //   parting: this.orderDetailForm.value.realPart,
    //   realPart: this.orderDetailForm.value.realPart,
    //   batch: this.orderDetailForm.value.batch,
    //   observation: this.orderDetailForm.value.observation,
    // };
    // this.orderDetails.push(masterOrderDetails);
    // this.localStorageService.saveLocalStorage(
    //   'masterOrderDetails',
    //   this.orderDetails,
    // );
    // this.orderDetailDialog = false;
    // this.resetOrderDetailForm();
  }

  openNew() {
    this.resetOrderDetailForm();
    this.orderDetailForm.patchValue({
      productionDate: new Date(),
    });
    this.orderDetailDialog = true;
  }

  resetOrderDetailForm() {
    this.orderDetailForm.reset();
  }

  saveAll() {
    this.store.dispatch(
      MasterOrderStoreActions.createMasterOrder({
        payload: this.masterOrderForm,
      }),
    );
    this.resetAll();
  }

  resetAll() {
    this.localStorageService.cleanLocalStorage('masterOrderForm');
    this.localStorageService.cleanLocalStorage('masterOrderDetails');
    this.masterOrderForm = [];
    this.orderDetails = [];
    this.resetOrderDetailForm();
  }
}
