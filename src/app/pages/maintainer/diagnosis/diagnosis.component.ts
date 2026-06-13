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
import { DiagnosisService } from '../../../services/diagnosis.service';
import { DiagnosisResourceDto } from '../../../model/diagnosis/diagnosis-resource.dto';
import { DiagnosisCreateDto } from '../../../model/diagnosis/diagnosis-create.dto';
import { DiagnosisUpdateDto } from '../../../model/diagnosis/diagnosis-update.dto';
import { DiagnosisFormDialogComponent } from './diagnosis-form-dialog.component';
import { SpinnerComponent } from '../../../utils/components/spinner/spinner.component';
import { ExcelExportService } from '../../../utils/services/excel-export.service';

@Component({
  selector: 'app-diagnosis',
  standalone: true,
  imports: [
    ButtonDirective,
    DialogModule,
    DiagnosisFormDialogComponent,
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
  templateUrl: './diagnosis.component.html',
})
export class DiagnosisComponent implements OnInit {
  @ViewChild('createForm') createFormRef!: DiagnosisFormDialogComponent;
  @ViewChild('editForm') editFormRef!: DiagnosisFormDialogComponent;

  cols: ColumModelDto[] = [];
  diagnosesList: DiagnosisResourceDto[] = [];
  nowDate = Date.now();
  loadingReport = false;

  displayCreateDialog = false;
  displayEditDialog = false;
  editingDiagnosis?: DiagnosisResourceDto;

  displayOk = false;
  displayError = false;
  messageError = '';
  isLoadingUpdate = false;

  constructor(
    private readonly diagnosisService: DiagnosisService,
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
      { field: 'grpGroup', header: 'Grupo' },
    ];
  }

  initDataTable(): void {
    this.loadingReport = true;
    this.diagnosisService.findAll().subscribe({
      next: (data) => {
        this.diagnosesList = data;
      },
      error: (err) => {
        console.error('Error loading diagnoses', err);
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
    this.editingDiagnosis = undefined;
    this.displayCreateDialog = true;
    this.createFormRef?.resetForm();
  }

  openEditDialog(diagnosis: DiagnosisResourceDto): void {
    this.editingDiagnosis = diagnosis;
    this.displayEditDialog = true;
    this.editFormRef?.resetForm();
  }

  saveCreate(payload: DiagnosisCreateDto): void {
    this.isLoadingUpdate = true;
    this.diagnosisService.create(payload).subscribe({
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

  saveEdit(id: string, payload: DiagnosisUpdateDto): void {
    this.isLoadingUpdate = true;
    this.diagnosisService.update(id, payload).subscribe({
      next: () => {
        this.displayEditDialog = false;
        this.editingDiagnosis = undefined;
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

  onEditSave(payload: DiagnosisUpdateDto): void {
    const id = this.editingDiagnosis?.id;
    if (id) {
      this.saveEdit(id, payload);
    }
  }

  confirmDelete(diagnosis: DiagnosisResourceDto): void {
    void this.handleDelete(diagnosis);
  }

  private async handleDelete(diagnosis: DiagnosisResourceDto): Promise<void> {
    const result = await Swal.fire({
      title: '¿Eliminar Diagnóstico?',
      text: `¿Está seguro que desea eliminar "${diagnosis.description ?? ''}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) {
      return;
    }
    this.isLoadingUpdate = true;
    this.diagnosisService.delete(diagnosis.id).subscribe({
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
    const exportData = this.diagnosesList.map((item) => ({
      Código: item.code ?? '',
      Descripción: item.description ?? '',
      Grupo: item.grpGroup ?? '',
      Estado: item.enabled ? 'Activo' : 'Inactivo',
    }));
    this.exportExcelService.exportToExcel(exportData, `diagnosticos_${this.nowDate}.xlsx`);
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
