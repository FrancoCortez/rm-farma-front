import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { Ripple } from 'primeng/ripple';
import { PrimeTemplate } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

import { ColumModelDto } from '../../../utils/models/colum-model.dto';
import { DoctorService } from '../../../services/doctor.service';
import { DoctorResourceDto } from '../../../model/doctor/doctor-resource.dto';
import { DoctorCreateResourceDto } from '../../../model/doctor/doctor-create-resource.dto';
import { DoctorUpdateResourceDto } from '../../../model/doctor/doctor-update-resource.dto';
import { DoctorFormDialogComponent } from './doctor-form-dialog.component';
import { SpinnerComponent } from '../../../utils/components/spinner/spinner.component';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    ButtonDirective,
    DialogModule,
    DoctorFormDialogComponent,
    NgForOf,
    NgIf,
    PrimeTemplate,
    Ripple,
    SpinnerComponent,
    TableModule,
    TagModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
  ],
  templateUrl: './doctor.component.html',
})
export class DoctorComponent implements OnInit {
  cols: ColumModelDto[] = [];
  doctorsList: DoctorResourceDto[] = [];
  loadingReport = false;

  displayCreateDialog = false;
  displayEditDialog = false;
  editingDoctor?: DoctorResourceDto;

  displayOk = false;
  displayError = false;
  messageError = '';
  isLoadingUpdate = false;

  constructor(private readonly doctorService: DoctorService) {}

  ngOnInit(): void {
    this.initColumns();
    this.initDataTable();
  }

  initColumns(): void {
    this.cols = [
      { field: 'rut', header: 'RUT' },
      { field: 'name', header: 'Nombre' },
      { field: 'code', header: 'Código' },
    ];
  }

  initDataTable(): void {
    this.loadingReport = true;
    this.doctorService.findAllDoctors().subscribe({
      next: (data) => {
        this.doctorsList = data;
      },
      error: (err) => {
        console.error('Error loading doctors', err);
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
    this.editingDoctor = undefined;
    this.displayCreateDialog = true;
  }

  openEditDialog(doctor: DoctorResourceDto): void {
    this.editingDoctor = doctor;
    this.displayEditDialog = true;
  }

  saveCreate(payload: DoctorCreateResourceDto): void {
    this.isLoadingUpdate = true;
    this.doctorService.createDoctor(payload).subscribe({
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

  saveEdit(id: string, payload: DoctorUpdateResourceDto): void {
    this.isLoadingUpdate = true;
    this.doctorService.updateDoctor(id, payload).subscribe({
      next: () => {
        this.displayEditDialog = false;
        this.editingDoctor = undefined;
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

  onEditSave(payload: DoctorUpdateResourceDto): void {
    const id = this.editingDoctor?.id;
    if (id) {
      this.saveEdit(id, payload);
    }
  }

  confirmDelete(doctor: DoctorResourceDto): void {
    void this.handleDelete(doctor);
  }

  private async handleDelete(doctor: DoctorResourceDto): Promise<void> {
    const result = await Swal.fire({
      title: '¿Eliminar Doctor?',
      text: `¿Está seguro que desea eliminar a ${doctor.name ?? ''}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) {
      return;
    }
    this.isLoadingUpdate = true;
    this.doctorService.deleteDoctor(doctor.id).subscribe({
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
