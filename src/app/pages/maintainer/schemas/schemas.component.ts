import { Component, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Button, ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgForOf, NgIf } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Table, TableModule } from 'primeng/table';
import { ColumModelDto } from '../../../utils/models/colum-model.dto';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SchemaService } from '../../../services/schema.service';
import { SchemaResourceDto } from '../../../model/schema/schema-resource.dto';
import { DialogModule } from 'primeng/dialog';
import { FormControlStatusDirective } from '../../../utils/directives/form-control-status.directive';
import { FormValidationMessagesComponent } from '../../../utils/components/form-validation-messages/form-validation-messages.component';
import { SchemaCreateDto } from '../../../model/schema/schema-create.dto';
import { ModalErrorComponent } from '../../../utils/components/modal-error/modal-error.component';
import { ModalSuccessComponent } from '../../../utils/components/modal-success/modal-success.component';
import { SpinnerComponent } from '../../../utils/components/spinner/spinner.component';
import { ExcelExportService } from '../../../utils/services/excel-export.service';

@Component({
  selector: 'app-schemas',
  standalone: true,
  imports: [
    ToastModule,
    ToolbarModule,
    ButtonDirective,
    Ripple,
    CalendarModule,
    MultiSelectModule,
    NgForOf,
    NgIf,
    SelectButtonModule,
    TableModule,
    FormsModule,
    InputTextModule,
    DialogModule,
    ReactiveFormsModule,
    FormControlStatusDirective,
    FormValidationMessagesComponent,
    ModalErrorComponent,
    ModalSuccessComponent,
    SpinnerComponent,
  ],
  templateUrl: './schemas.component.html',
})
export class SchemasComponent implements OnInit {
  cols: ColumModelDto[] = [];
  nowDate = Date.now();
  loadingReport = false;
  schemasList: SchemaResourceDto[] = [];
  createDialogVisible = false;
  schemaCreateForm!: FormGroup;
  displayOk = false;
  displayError = false;
  isLoadingUpdate = false;
  messageError = '';

  constructor(
    private readonly schemaService: SchemaService,
    private readonly exportExcelService: ExcelExportService,
    private fb: FormBuilder,
  ) {}

  initDataTable() {
    this.loadingReport = true;
    this.schemaService.findAllSchemas().subscribe({
      next: (data) => {
        this.schemasList = data;
      },
      error: (err) => {
        console.error('Error loading schemas', err);
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
    this.schemaCreateForm = this.fb.group({
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

  protected saveSchema() {
    this.isLoadingUpdate = true;
    const formValue = this.schemaCreateForm.value;
    const schemaCreateDto: SchemaCreateDto = {
      code: formValue.code,
      description: formValue.description,
    };
    console.log(schemaCreateDto);
    this.schemaService.createSchema(schemaCreateDto).subscribe({
      next: (data) => {
        this.createDialogVisible = false;
        this.schemaCreateForm.reset();
        this.displayOk = true;
      },
      error: (err) => {
        console.log(err.error.errors);
        if (err.status === 400) {
          this.messageError = err.error.errors || 'Error de validación.';
        } else if (err.status === 500) {
          this.messageError = 'Ocurrió un error inesperado en el servidor.';
        } else {
          this.messageError = 'No se logro crear el Esquema.';
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
    this.schemaCreateForm.reset();
    this.createDialogVisible = false;
  }

  protected exportExcel() {
    const exportData = this.schemasList.map((item) => {
      const row: any = {};
      this.cols.forEach((col) => {
        row[col.header] = this.parseFieldInData(item, col.field);
      });
      return row;
    });
    this.exportExcelService.exportToExcel(
      exportData,
      `commercial_product_${this.nowDate}.xlsx`,
    );
  }
}
