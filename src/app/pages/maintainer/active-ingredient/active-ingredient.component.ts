import { Component, OnInit } from '@angular/core';
import { ColumModelDto } from '../../../utils/models/colum-model.dto';
import { SchemaResourceDto } from '../../../model/schema/schema-resource.dto';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProductResourceDto } from '../../../model/product/product-resource.dto';
import { SchemaService } from '../../../services/schema.service';
import { ProductService } from '../../../services/product.service';
import { Table, TableModule } from 'primeng/table';
import { SchemaCreateDto } from '../../../model/schema/schema-create.dto';
import { ActiveIngredientCreateDto } from '../../../model/product/active-ingredient-create.dto';
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
import { ExcelExportService } from '../../../utils/services/excel-export.service';

@Component({
  selector: 'app-active-ingredient',
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
  ],
  templateUrl: './active-ingredient.component.html',
})
export class ActiveIngredientComponent implements OnInit {
  cols: ColumModelDto[] = [];
  nowDate = Date.now();
  loadingReport = false;
  activeIngredientList: ProductResourceDto[] = [];
  createDialogVisible = false;
  activeIngredientCreateForm!: FormGroup;
  displayOk = false;
  displayError = false;
  isLoadingUpdate = false;
  messageError = '';

  constructor(
    private readonly productService: ProductService,
    private readonly exportExcelService: ExcelExportService,
    private fb: FormBuilder,
  ) {}

  initDataTable() {
    this.loadingReport = true;
    this.productService.findAllProducts().subscribe({
      next: (data) => {
        this.activeIngredientList = data;
      },
      error: (err) => {
        console.error('Error loading pa', err);
      },
      complete: () => {
        this.loadingReport = false;
      },
    });
  }

  ngOnInit(): void {
    this.initColumns();
    this.initDataTable();
  }
  initFormCreate() {
    this.activeIngredientCreateForm = this.fb.group({
      code: [''],
      description: [''],
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
    if (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
    ) {
      const date = new Date(value);
      // Formatea a dd/MM/yyyy hh:mm:ss
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

  protected saveActiveIngredient() {
    this.isLoadingUpdate = true;
    const formValue = this.activeIngredientCreateForm.value;
    const createDto: ActiveIngredientCreateDto = {
      code: formValue.code,
      description: formValue.description,
    };
    this.productService.createActiveIngredient(createDto).subscribe({
      next: (data) => {
        this.createDialogVisible = false;
        this.activeIngredientCreateForm.reset();
        this.displayOk = true;
      },
      error: (err) => {
        console.log(err.error.errors);
        if (err.status === 400) {
          this.messageError = err.error.errors || 'Error de validación.';
        } else if (err.status === 500) {
          this.messageError = 'Ocurrió un error inesperado en el servidor.';
        } else {
          this.messageError = 'No se logro crear el PA.';
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
    this.activeIngredientCreateForm.reset();
    this.createDialogVisible = false;
  }

  protected exportExcel() {
    const exportData = this.activeIngredientList.map((item) => {
      const row: any = {};
      this.cols.forEach((col) => {
        row[col.header] = this.parseFieldInData(item, col.field);
      });
      return row;
    });
    this.exportExcelService.exportToExcel(
      exportData,
      `pa_${this.nowDate}.xlsx`,
    );
  }
}
