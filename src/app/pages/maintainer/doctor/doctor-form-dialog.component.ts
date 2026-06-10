import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { FormControlStatusDirective } from '../../../utils/directives/form-control-status.directive';
import { FormValidationMessagesComponent } from '../../../utils/components/form-validation-messages/form-validation-messages.component';
import { RutFormatterDirective } from '../../../utils/directives/rut-formatter.directive';
import { rutValidator } from '../../../utils/form-validation/rut-validator.form';
import { DoctorResourceDto } from '../../../model/doctor/doctor-resource.dto';
import { DoctorCreateResourceDto } from '../../../model/doctor/doctor-create-resource.dto';
import { DoctorUpdateResourceDto } from '../../../model/doctor/doctor-update-resource.dto';

export type DoctorFormMode = 'create' | 'edit';

@Component({
  selector: 'app-doctor-form-dialog',
  standalone: true,
  imports: [
    ButtonDirective,
    DialogModule,
    FormControlStatusDirective,
    FormValidationMessagesComponent,
    FormsModule,
    InputTextModule,
    NgIf,
    ReactiveFormsModule,
    Ripple,
    RutFormatterDirective,
  ],
  templateUrl: './doctor-form-dialog.component.html',
})
export class DoctorFormDialogComponent implements OnInit, OnChanges {
  @Input() mode: DoctorFormMode = 'create';
  @Input() doctor?: DoctorResourceDto;
  @Output() save = new EventEmitter<
    DoctorCreateResourceDto | DoctorUpdateResourceDto
  >();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  dialogHeader = 'Nuevo Doctor';

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.applyMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-apply the patch when the doctor input changes after init.
    if (changes['doctor'] && this.form) {
      this.applyMode();
    }
  }

  private buildForm(): void {
    if (this.mode === 'create') {
      this.form = this.fb.group({
        rut: ['', [Validators.required, rutValidator()]],
        name: ['', [Validators.required, Validators.maxLength(120)]],
        code: [
          null,
          [Validators.required, Validators.pattern(/^[1-9]\d{0,4}$/)],
        ],
      });
    } else {
      this.form = this.fb.group({
        rut: ['', [Validators.required, rutValidator()]],
        name: ['', [Validators.required, Validators.maxLength(120)]],
      });
    }
  }

  private applyMode(): void {
    this.dialogHeader = this.mode === 'edit' ? 'Editar Doctor' : 'Nuevo Doctor';
    if (this.mode === 'edit' && this.doctor) {
      this.form.patchValue({
        rut: this.doctor.rut ?? '',
        name: this.doctor.name ?? '',
      });
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      return;
    }
    const value = this.form.value as {
      rut: string;
      name: string;
      code?: number;
    };
    if (this.mode === 'create') {
      const payload: DoctorCreateResourceDto = {
        rut: value.rut,
        name: value.name,
        code: value.code,
      };
      this.save.emit(payload);
    } else {
      const payload: DoctorUpdateResourceDto = {
        rut: value.rut,
        name: value.name,
      };
      this.save.emit(payload);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
