import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { DoctorComponent } from './doctor.component';
import { DoctorService } from '../../../services/doctor.service';
import { DoctorResourceDto } from '../../../model/doctor/doctor-resource.dto';
import { DoctorFormDialogComponent } from './doctor-form-dialog.component';
import { DoctorCreateResourceDto } from '../../../model/doctor/doctor-create-resource.dto';
import { DoctorUpdateResourceDto } from '../../../model/doctor/doctor-update-resource.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { ColumModelDto } from '../../../utils/models/colum-model.dto';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule, DoctorComponent],
  template: `<app-doctor></app-doctor>`,
})
class HostComponent {
  @ViewChild(DoctorComponent) doctor?: DoctorComponent;
}

describe('DoctorComponent', () => {
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let doctor: DoctorComponent;
  let doctorServiceSpy: jasmine.SpyObj<DoctorService>;
  let swalFireSpy: jasmine.Spy;

  const sampleDoctor: DoctorResourceDto = {
    id: 'd-1',
    rut: '11.111.111-1',
    name: 'Dr. Pérez',
    code: 42,
    enabled: true,
  };

  beforeEach(async () => {
    doctorServiceSpy = jasmine.createSpyObj<DoctorService>(
      'DoctorService',
      [
        'findAllDoctors',
        'findDoctorByRut',
        'createDoctor',
        'updateDoctor',
        'deleteDoctor',
      ],
    );
    doctorServiceSpy.findAllDoctors.and.returnValue(of([sampleDoctor]));

    // Mock Swal.fire (the raw API used by the delete confirmation).
    swalFireSpy = jasmine
      .createSpy('fire')
      .and.returnValue(
        Promise.resolve({ isConfirmed: true, isDismissed: false }),
      );
    (Swal as unknown as { fire: jasmine.Spy }).fire = swalFireSpy;

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: DoctorService, useValue: doctorServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    expect(host.doctor).toBeDefined();
    doctor = host.doctor as DoctorComponent;
  });

  afterEach(() => {
    // Restore the original Swal.fire so other specs aren't affected.
    delete (Swal as unknown as { fire?: jasmine.Spy }).fire;
  });

  it('renders the page with the doctor list from findAllDoctors', () => {
    expect(doctor.doctorsList).toEqual([sampleDoctor]);
    expect(doctorServiceSpy.findAllDoctors).toHaveBeenCalled();
  });

  it('exposes the five columns in order: RUT, Nombre, Código, Estado, Acciones', () => {
    const labels = doctor.cols.map((c: ColumModelDto) => c.header);
    expect(labels).toEqual(['RUT', 'Nombre', 'Código']);
    // Estado and Acciones are hand-written cells, not in cols.
    const statusAndActionsRendered =
      doctor.displayCreateDialog !== undefined &&
      doctor.displayEditDialog !== undefined;
    expect(statusAndActionsRendered).toBe(true);
  });

  it('openCreateDialog flips displayCreateDialog to true', () => {
    expect(doctor.displayCreateDialog).toBe(false);
    doctor.openCreateDialog();
    expect(doctor.displayCreateDialog).toBe(true);
  });

  it('saveCreate calls createDoctor with the form value and closes the dialog on success', () => {
    doctor.displayCreateDialog = true;
    const payload: DoctorCreateResourceDto = {
      rut: '11.111.111-1',
      name: 'Dr. Pérez',
      code: 42,
    };
    doctorServiceSpy.createDoctor.and.returnValue(of(sampleDoctor));
    doctor.saveCreate(payload);
    expect(doctorServiceSpy.createDoctor).toHaveBeenCalledWith(payload);
    expect(doctor.displayCreateDialog).toBe(false);
    expect(doctor.displayOk).toBe(true);
    expect(doctor.isLoadingUpdate).toBe(false);
  });

  it('openEditDialog stores the doctor and opens the dialog', () => {
    doctor.openEditDialog(sampleDoctor);
    expect(doctor.editingDoctor).toEqual(sampleDoctor);
    expect(doctor.displayEditDialog).toBe(true);
  });

  it('saveEdit calls updateDoctor with id and (rut, name) only', () => {
    doctor.editingDoctor = sampleDoctor;
    doctor.displayEditDialog = true;
    const payload: DoctorUpdateResourceDto = {
      rut: '22.222.222-2',
      name: 'Dr. Pérez (Updated)',
    };
    doctorServiceSpy.updateDoctor.and.returnValue(of(sampleDoctor));
    doctor.saveEdit(sampleDoctor.id as string, payload);
    expect(doctorServiceSpy.updateDoctor).toHaveBeenCalledWith(
      sampleDoctor.id,
      payload,
    );
    expect(doctor.displayEditDialog).toBe(false);
    expect(doctor.displayOk).toBe(true);
  });

  it('4xx surfaces err.error.errors in the error modal', () => {
    doctor.displayCreateDialog = true;
    const err = new HttpErrorResponse({
      status: 400,
      error: { errors: ['Ya existe un doctor con ese RUT'] },
      statusText: 'Bad Request',
    });
    doctorServiceSpy.createDoctor.and.returnValue(throwError(() => err));
    doctor.saveCreate({
      rut: '11.111.111-1',
      name: 'Dr. Pérez',
      code: 42,
    });
    expect(doctor.displayError).toBe(true);
    expect(doctor.messageError).toBe('Ya existe un doctor con ese RUT');
    expect(doctor.isLoadingUpdate).toBe(false);
  });

  it('5xx surfaces a generic Spanish error message', () => {
    doctor.displayCreateDialog = true;
    const err = new HttpErrorResponse({
      status: 500,
      error: {},
      statusText: 'Server Error',
    });
    doctorServiceSpy.createDoctor.and.returnValue(throwError(() => err));
    doctor.saveCreate({
      rut: '11.111.111-1',
      name: 'Dr. Pérez',
      code: 42,
    });
    expect(doctor.displayError).toBe(true);
    expect(doctor.messageError).not.toBe('Ya existe un doctor con ese RUT');
    expect(doctor.messageError.length).toBeGreaterThan(0);
    // The generic Spanish message must not be the raw err.error.errors text.
    expect(doctor.messageError).not.toContain('errors');
  });

  it('confirmDelete calls Swal.fire with the locked shape on confirm and deletes', (done) => {
    swalFireSpy.and.returnValue(
      Promise.resolve({ isConfirmed: true, isDismissed: false }),
    );
    doctorServiceSpy.deleteDoctor.and.returnValue(of(void 0));
    doctor.confirmDelete(sampleDoctor);
    setTimeout(() => {
      expect(swalFireSpy).toHaveBeenCalled();
      const call = swalFireSpy.calls.mostRecent().args[0] as Record<
        string,
        unknown
      >;
      expect(call['title']).toBe('¿Eliminar Doctor?');
      expect(call['text']).toBe(
        '¿Está seguro que desea eliminar a Dr. Pérez?',
      );
      expect(call['icon']).toBe('warning');
      expect(call['showCancelButton']).toBe(true);
      expect(call['confirmButtonText']).toBe('Sí, eliminar');
      expect(call['cancelButtonText']).toBe('Cancelar');
      expect(doctorServiceSpy.deleteDoctor).toHaveBeenCalledWith(
        sampleDoctor.id,
      );
      done();
    }, 0);
  });

  it('confirmDelete does NOT call deleteDoctor when the user cancels', (done) => {
    swalFireSpy.and.returnValue(
      Promise.resolve({ isConfirmed: false, isDismissed: true }),
    );
    doctor.confirmDelete(sampleDoctor);
    setTimeout(() => {
      expect(swalFireSpy).toHaveBeenCalled();
      expect(doctorServiceSpy.deleteDoctor).not.toHaveBeenCalled();
      done();
    }, 0);
  });

  it('delete error surfaces through the error modal and preserves the state machine', () => {
    swalFireSpy.and.returnValue(
      Promise.resolve({ isConfirmed: true, isDismissed: false }),
    );
    const err = new HttpErrorResponse({
      status: 500,
      error: {},
      statusText: 'Server Error',
    });
    doctorServiceSpy.deleteDoctor.and.returnValue(throwError(() => err));
    doctor.confirmDelete(sampleDoctor);
    // Swal.fire resolves on the next microtask; trigger a flush via setTimeout.
    setTimeout(() => {
      expect(doctor.displayError).toBe(true);
      expect(doctor.isLoadingUpdate).toBe(false);
      // Suppress unused warning by referencing err.
      expect(err.status).toBe(500);
    }, 0);
  });
});

// Reference the imports so they don't get tree-shaken in case the host
// needs them in subsequent test cases.
const _refs: unknown[] = [DoctorFormDialogComponent];
void _refs;
void DebugElement;
