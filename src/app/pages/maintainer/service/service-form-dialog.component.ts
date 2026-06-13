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
import { ServiceResourceDto } from '../../../model/service/service-resource.dto';
import { ServiceCreateDto } from '../../../model/service/service-create.dto';
import { ServiceUpdateDto } from '../../../model/service/service-update.dto';

export type ServiceFormMode = 'create' | 'edit';

@Component({
  selector: 'app-service-form-dialog',
  standalone: true,
  imports: [
    ButtonDirective,
    DialogModule,
    FormControlStatusDirective,
    FormValidationMessagesComponent,
    InputTextModule,
    NgIf,
    ReactiveFormsModule,
    Ripple,
  ],
  templateUrl: './service-form-dialog.component.html',
})
export class ServiceFormDialogComponent implements OnInit, OnChanges {
  @Input() mode: ServiceFormMode = 'create';
  @Input() service?: ServiceResourceDto;
  @Output() save = new EventEmitter<ServiceCreateDto | ServiceUpdateDto>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.applyMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['service'] && this.form) {
      this.applyMode();
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  private applyMode(): void {
    if (this.mode === 'edit' && this.service) {
      this.form.patchValue({
        code: this.service.code ?? '',
        description: this.service.description ?? '',
      });
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      return;
    }
    const value = this.form.value as {
      code: string;
      description: string;
    };
    this.save.emit(value);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  resetForm(): void {
    this.buildForm();
    this.applyMode();
  }
}
