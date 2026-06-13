import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { Ripple } from 'primeng/ripple';
import { PrimeTemplate } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

import { ColumModelDto } from '../../../utils/models/colum-model.dto';
import { ServiceService } from '../../../services/service.service';
import { ServiceResourceDto } from '../../../model/service/service-resource.dto';
import { ServiceCreateDto } from '../../../model/service/service-create.dto';
import { ServiceUpdateDto } from '../../../model/service/service-update.dto';
import { ServiceFormDialogComponent } from './service-form-dialog.component';
import { SpinnerComponent } from '../../../utils/components/spinner/spinner.component';
import { ExcelExportService } from '../../../utils/services/excel-export.service';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [
    ButtonDirective,
    DialogModule,
    ServiceFormDialogComponent,
    NgForOf,
    NgIf,
    PrimeTemplate,
    Ripple,
    SpinnerComponent,
    TableModule,
    TagModule,
    ToastModule,
    InputTextModule,
    ToolbarModule,
  ],
  templateUrl: './service.component.html',
})
export class ServiceComponent implements OnInit {
  @ViewChild('createForm') createFormRef!: ServiceFormDialogComponent;
  @ViewChild('editForm') editFormRef!: ServiceFormDialogComponent;

  cols: ColumModelDto[] = [];
  servicesList: ServiceResourceDto[] = [];
  nowDate = Date.now();
  loadingReport = false;

  displayCreateDialog = false;
  displayEditDialog = false;
  editingService?: ServiceResourceDto;

  displayOk = false;
  displayError = false;
  messageError = '';
  isLoadingUpdate = false;

  constructor(
    private readonly serviceService: ServiceService,
    private readonly exportExcelService: ExcelExportService,
  ) {}

  ngOnInit(): void {
    this.initColumns();
    this.initDataTable();
  }

  initColumns(): void {
    this.cols = [
      { field: 'code', header: 'Código' },
      { field: 'description', header: 'Descripción' },
    ];
  }

  initDataTable(): void {
    this.loadingReport = true;
    this.serviceService.findAll().subscribe({
      next: (data) => {
        this.servicesList = data;
      },
      error: (err) => {
        console.error('Error loading services', err);
      },
      complete: () => {
        this.loadingReport = false;
      },
    });
  }

  protected onGlobalFilter(dt: Table, event: Event): void {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openCreateDialog(): void {
    this.editingService = undefined;
    this.displayCreateDialog = true;
    this.createFormRef?.resetForm();
  }

  openEditDialog(service: ServiceResourceDto): void {
    this.editingService = service;
    this.displayEditDialog = true;
    this.editFormRef?.resetForm();
  }

  saveCreate(payload: ServiceCreateDto): void {
    this.isLoadingUpdate = true;
    this.serviceService.create(payload).subscribe({
      next: () => {
        this.displayCreateDialog = false;
        this.isLoadingUpdate = false;
        this.displayOk = true;
      },
      error: (err: HttpErrorResponse) => {
        this.messageError = this.resolveErrorMessage(err);
        this.displayError = true;
        this.isLoadingUpdate = false;
      },
    });
  }

  saveEdit(
    id: string,
    payload: ServiceUpdateDto,
  ): void {
    this.isLoadingUpdate = true;
    this.serviceService.update(id, payload).subscribe({
      next: () => {
        this.displayEditDialog = false;
        this.editingService = undefined;
        this.isLoadingUpdate = false;
        this.displayOk = true;
      },
      error: (err: HttpErrorResponse) => {
        this.messageError = this.resolveErrorMessage(err);
        this.displayError = true;
        this.isLoadingUpdate = false;
      },
    });
  }

  onEditSave(payload: ServiceUpdateDto): void {
    const id = this.editingService?.id;
    if (id) {
      this.saveEdit(id, payload);
    }
  }

  confirmDelete(service: ServiceResourceDto): void {
    void this.handleDelete(service);
  }

  private async handleDelete(service: ServiceResourceDto): Promise<void> {
    const result = await Swal.fire({
      title: '¿Eliminar Servicio?',
      text: `¿Está seguro que desea eliminar "${service.description ?? ''}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) {
      return;
    }
    this.isLoadingUpdate = true;
    this.serviceService.delete(service.id).subscribe({
      next: () => {
        this.isLoadingUpdate = false;
        this.displayOk = true;
      },
      error: (err: HttpErrorResponse) => {
        this.messageError = this.resolveErrorMessage(err);
        this.displayError = true;
        this.isLoadingUpdate = false;
      },
    });
  }

  confirmDialog($event: boolean): void {
    this.displayOk = $event;
    this.initDataTable();
  }

  confirmDialogError(_$event: boolean): void {
    this.displayError = false;
  }

  cancelModal(): void {
    this.displayCreateDialog = false;
    this.displayEditDialog = false;
  }

  protected exportExcel(): void {
    const exportData = this.servicesList.map((item) => ({
      Código: item.code ?? '',
      Descripción: item.description ?? '',
      Estado: item.enabled ? 'Activo' : 'Inactivo',
    }));
    this.exportExcelService.exportToExcel(exportData, `servicios_${this.nowDate}.xlsx`);
  }

  private resolveErrorMessage(err: HttpErrorResponse): string {
    if (err.status >= 400 && err.status < 500) {
      return (
        (err.error as { errors?: string[] } | null)?.errors?.[0] ??
        'Error al procesar la solicitud'
      );
    }
    return 'Ocurrió un error inesperado. Intente nuevamente.';
  }
}
