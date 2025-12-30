import { Component, OnInit } from '@angular/core';
import { ColumModelDto } from '../../../utils/models/colum-model.dto';
import { ProductResourceDto } from '../../../model/product/product-resource.dto';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommercialProductResourceDto } from '../../../model/commercial-product/commercial-product-resource.dto';
import { ProductService } from '../../../services/product.service';
import { CommercialProductService } from '../../../services/commercial-product.service';
import { Table, TableModule } from 'primeng/table';
import { ActiveIngredientCreateDto } from '../../../model/product/active-ingredient-create.dto';
import { CommercialProductCreateDto } from '../../../model/commercial-product/commercial-product-create.dto';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormValidationMessagesComponent } from '../../../utils/components/form-validation-messages/form-validation-messages.component';
import { InputTextModule } from 'primeng/inputtext';
import { ModalErrorComponent } from '../../../utils/components/modal-error/modal-error.component';
import { ModalSuccessComponent } from '../../../utils/components/modal-success/modal-success.component';
import { NgForOf, NgIf } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { SpinnerComponent } from '../../../utils/components/spinner/spinner.component';
import { ToolbarModule } from 'primeng/toolbar';
import { FormControlStatusDirective } from '../../../utils/directives/form-control-status.directive';
import { ComboModelDto } from '../../../utils/models/combo-model.dto';
import { map } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ExcelExportService } from '../../../utils/services/excel-export.service';

@Component({
  selector: 'app-commercial-product',
  standalone: true,
  imports: [
    ButtonDirective,
    DialogModule,
    FormValidationMessagesComponent,
    FormsModule,
    InputTextModule,
    ModalErrorComponent,
    ModalSuccessComponent,
    NgForOf,
    NgIf,
    PrimeTemplate,
    ReactiveFormsModule,
    Ripple,
    SpinnerComponent,
    TableModule,
    ToolbarModule,
    FormControlStatusDirective,
    DropdownModule,
    InputNumberModule,
  ],
  templateUrl: './commercial-product.component.html',
})
export class CommercialProductComponent implements OnInit {
  cols: ColumModelDto[] = [];
  nowDate = Date.now();
  loadingReport = false;
  commercialProductList: CommercialProductResourceDto[] = [];
  createDialogVisible = false;
  commercialProductCreateForm!: FormGroup;
  displayOk = false;
  displayError = false;
  isLoadingUpdate = false;
  messageError = '';
  activeIngredientCombo: ComboModelDto[] = [];
  unitMetricCombo: ComboModelDto[] = [];

  constructor(
    private readonly commercialProductService: CommercialProductService,
    private readonly productService: ProductService,
    private readonly exportExcelService: ExcelExportService,
    private fb: FormBuilder,
  ) {}

  initFormCreate() {
    this.commercialProductCreateForm = this.fb.group({
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
      laboratory: [''],
      activeIngredientCode: ['', [Validators.required]],
      concentration: [null, [Validators.required]],
      concentrationUnit: ['', [Validators.required]],
    });
  }

  initCombo() {
    this.initActiveIngredientCombo();
    this.initComboUnitMetric();
  }

  initComboUnitMetric() {
    this.unitMetricCombo = [
      { code: 'MG/ML', name: 'MG/ML' },
      { code: 'UI/ML', name: 'UI/ML' },
      { code: 'U/ML', name: 'U/ML' },
    ];
  }

  initDataTable() {
    this.loadingReport = true;
    this.commercialProductService.findAllCommercialProducts().subscribe({
      next: (data) => {
        this.commercialProductList = data;
      },
      error: (err) => {
        console.error('Error loading Commercial Product', err);
      },
      complete: () => {
        this.loadingReport = false;
      },
    });
  }
  ngOnInit(): void {
    this.initColumns();
    this.initCombo();
    this.initDataTable();
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
    if (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
    ) {
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
    return value;
  }

  initColumns() {
    this.cols = [
      { field: 'code', header: 'Código' },
      { field: 'description', header: 'Descripción' },
      { field: 'concentration', header: 'Concentración' },
      { field: 'concentrationUnit', header: 'Unidad de Concentración' },
      { field: 'laboratory', header: 'Laboratorio' },
      { field: 'product.code', header: 'PA. Código' },
      { field: 'product.description', header: 'PA. Nombre' },
      { field: 'createdDate', header: 'F. Creación' },
      { field: 'lastModifiedDate', header: 'F. Actualización' },
    ];
  }
  protected onGlobalFilter(dt: Table, event: Event) {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  protected openCreateModal() {
    this.initFormCreate();
    this.createDialogVisible = true;
  }

  protected saveCommercialProduct() {
    this.isLoadingUpdate = true;
    const formValue = this.commercialProductCreateForm.value;
    console.log(formValue);
    const createDto: CommercialProductCreateDto = {
      code: formValue.code,
      description: formValue.description,
      laboratory: formValue.laboratory,
      activeIngredientCode: formValue.activeIngredientCode.code,
      concentration: formValue.concentration,
      concentrationUnit: formValue.concentrationUnit.code,
    };
    console.log(createDto);
    this.commercialProductService.createCommercialProduct(createDto).subscribe({
      next: (data) => {
        this.createDialogVisible = false;
        // this.commercialProductCreateForm.reset();
        this.displayOk = true;
      },
      error: (err) => {
        console.log(err.error.errors);
        if (err.status === 400) {
          this.messageError = err.error.errors || 'Error de validación.';
        } else if (err.status === 500) {
          this.messageError = 'Ocurrió un error inesperado en el servidor.';
        } else {
          this.messageError = 'No se logro crear el Producto Comercial.';
        }
        this.displayError = true;
        this.isLoadingUpdate = false;
      },
      complete: () => {
        this.isLoadingUpdate = false;
      },
    });
  }

  confirmDialog($event: boolean) {
    this.displayOk = $event;
    this.initDataTable();
  }

  confirmDialogError($event: boolean) {
    this.displayError = false;
  }
  protected cancelModal() {
    this.commercialProductCreateForm.reset();
    this.createDialogVisible = false;
  }

  private initActiveIngredientCombo() {
    this.productService
      .findAllProducts()
      .pipe(
        map((m) => {
          return m.map((item) => {
            return {
              code: item.code,
              name: item.description,
            };
          });
        }),
      )
      .subscribe({
        next: (data) => {
          this.activeIngredientCombo = data;
        },
        error: (err) => {},
        complete: () => {},
      });
  }

  protected exportExcel() {
    const exportData = this.commercialProductList.map((item) => {
      const row: any = {};
      this.cols.forEach((col) => {
        row[col.header] = this.parseFieldInData(item, col.field);
      });
      return row;
    });
    this.exportExcelService.exportToExcel(
      exportData,
      `schemas_${this.nowDate}.xlsx`,
    );
  }
}
