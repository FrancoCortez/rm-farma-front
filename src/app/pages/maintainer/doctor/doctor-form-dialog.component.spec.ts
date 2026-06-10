import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DoctorFormDialogComponent,
  DoctorFormMode,
} from './doctor-form-dialog.component';
import { DoctorResourceDto } from '../../../model/doctor/doctor-resource.dto';

@Component({
  standalone: true,
  imports: [CommonModule, DoctorFormDialogComponent],
  template: `
    <app-doctor-form-dialog
      [mode]="mode"
      [doctor]="doctor"
      (save)="onSave($event)"
      (cancel)="onCancel()"
    ></app-doctor-form-dialog>
  `,
})
class HostComponent {
  @ViewChild(DoctorFormDialogComponent)
  dialog?: DoctorFormDialogComponent;
  mode: DoctorFormMode = 'create';
  doctor?: DoctorResourceDto;
  savedPayload: unknown = null;
  cancelled = false;

  onSave(payload: unknown): void {
    this.savedPayload = payload;
  }

  onCancel(): void {
    this.cancelled = true;
  }
}

describe('DoctorFormDialogComponent', () => {
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  /**
   * Recreates the host fixture with a fresh `mode` and `doctor` so each
   * test starts from a clean state.
   */
  function rebuild(opts: {
    mode: DoctorFormMode;
    doctor?: DoctorResourceDto;
  }): void {
    fixture.destroy();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    host.mode = opts.mode;
    host.doctor = opts.doctor;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    host.mode = 'create';
    fixture.detectChanges();
  });

  function getDialog(): DoctorFormDialogComponent {
    expect(host.dialog).toBeDefined();
    return host.dialog as DoctorFormDialogComponent;
  }

  it('form is invalid when all controls are empty (create mode)', () => {
    rebuild({ mode: 'create' });
    const dialog = getDialog();
    expect(dialog.form.invalid).toBe(true);
  });

  it('rut control has a required error when empty', () => {
    rebuild({ mode: 'create' });
    const dialog = getDialog();
    const rut = dialog.form.get('rut');
    expect(rut).toBeTruthy();
    expect(rut!.errors).toEqual(jasmine.objectContaining({ required: true }));
  });

  it('rut control rejects an invalid check digit with invalidRut error', () => {
    rebuild({ mode: 'create' });
    const dialog = getDialog();
    const rut = dialog.form.get('rut')!;
    rut.setValue('11.111.111-0');
    rut.markAsDirty();
    rut.updateValueAndValidity();
    expect(rut.errors).toEqual(jasmine.objectContaining({ invalidRut: true }));
  });

  it('rut control accepts a valid check digit', () => {
    rebuild({ mode: 'create' });
    const dialog = getDialog();
    const rut = dialog.form.get('rut')!;
    rut.setValue('11.111.111-1');
    rut.markAsDirty();
    rut.updateValueAndValidity();
    expect(rut.valid).toBe(true);
  });

  it('code control is required when empty in create mode', () => {
    rebuild({ mode: 'create' });
    const dialog = getDialog();
    const code = dialog.form.get('code')!;
    expect(code.errors).toEqual(jasmine.objectContaining({ required: true }));
  });

  it('code control rejects 0 (out of range)', () => {
    rebuild({ mode: 'create' });
    const dialog = getDialog();
    const code = dialog.form.get('code')!;
    code.setValue(0);
    code.markAsDirty();
    code.updateValueAndValidity();
    expect(code.invalid).toBe(true);
  });

  it('code control rejects 100000 (above max 99999)', () => {
    rebuild({ mode: 'create' });
    const dialog = getDialog();
    const code = dialog.form.get('code')!;
    code.setValue(100000);
    code.markAsDirty();
    code.updateValueAndValidity();
    expect(code.invalid).toBe(true);
  });

  it('code control accepts a value in range 1..99999', () => {
    rebuild({ mode: 'create' });
    const dialog = getDialog();
    const rut = dialog.form.get('rut')!;
    rut.setValue('11.111.111-1');
    rut.markAsDirty();
    rut.updateValueAndValidity();
    const name = dialog.form.get('name')!;
    name.setValue('Dr. Pérez');
    name.markAsDirty();
    name.updateValueAndValidity();
    const code = dialog.form.get('code')!;
    code.setValue(42);
    code.markAsDirty();
    code.updateValueAndValidity();
    expect(code.valid).toBe(true);
    expect(dialog.form.valid).toBe(true);
  });

  it('edit mode does not expose a code control', () => {
    rebuild({ mode: 'edit' });
    const dialog = getDialog();
    expect(dialog.form.get('code')).toBeNull();
  });

  it('edit mode pre-fills rut and name from the doctor input', () => {
    rebuild({
      mode: 'edit',
      doctor: {
        id: 'd-1',
        rut: '11.111.111-1',
        name: 'Dr. Pérez',
        code: 42,
        enabled: true,
      },
    });
    const dialog = getDialog();
    expect(dialog.form.get('rut')!.value).toBe('11.111.111-1');
    expect(dialog.form.get('name')!.value).toBe('Dr. Pérez');
  });

  it('save emits the create payload (rut, name, code) when valid', () => {
    rebuild({ mode: 'create' });
    const dialog = getDialog();
    dialog.form.get('rut')!.setValue('11.111.111-1');
    dialog.form.get('name')!.setValue('Dr. Pérez');
    dialog.form.get('code')!.setValue(42);
    dialog.form.updateValueAndValidity();
    dialog.onSave();
    expect(host.savedPayload).toEqual({
      rut: '11.111.111-1',
      name: 'Dr. Pérez',
      code: 42,
    });
  });

  it('save emits only rut and name in edit mode (no code)', () => {
    rebuild({
      mode: 'edit',
      doctor: {
        id: 'd-1',
        rut: '11.111.111-1',
        name: 'Dr. Pérez',
        code: 42,
        enabled: true,
      },
    });
    const dialog = getDialog();
    dialog.form.get('rut')!.setValue('22.222.222-2');
    dialog.form.get('name')!.setValue('Dr. Pérez (Updated)');
    dialog.form.updateValueAndValidity();
    dialog.onSave();
    expect(host.savedPayload).toEqual({
      rut: '22.222.222-2',
      name: 'Dr. Pérez (Updated)',
    });
    expect(
      (host.savedPayload as Record<string, unknown>)['code'],
    ).toBeUndefined();
  });

  it('cancel emits a void event', () => {
    rebuild({ mode: 'create' });
    const dialog = getDialog();
    dialog.onCancel();
    expect(host.cancelled).toBe(true);
  });
});
