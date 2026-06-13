import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { FormControlStatusDirective } from '../../../utils/directives/form-control-status.directive';
import { FormValidationMessagesComponent } from '../../../utils/components/form-validation-messages/form-validation-messages.component';
import { DiagnosisResourceDto } from '../../../model/diagnosis/diagnosis-resource.dto';
import { DiagnosisCreateDto } from '../../../model/diagnosis/diagnosis-create.dto';
import { DiagnosisUpdateDto } from '../../../model/diagnosis/diagnosis-update.dto';

export type DiagnosisFormMode = 'create' | 'edit';

@Component({
  selector: 'app-diagnosis-form-dialog',
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
  templateUrl: './diagnosis-form-dialog.component.html',
})
export class DiagnosisFormDialogComponent implements OnInit, OnChanges {
  @Input() mode: DiagnosisFormMode = 'create';
  @Input() diagnosis?: DiagnosisResourceDto;
  @Output() saveCreate = new EventEmitter<DiagnosisCreateDto>();
  @Output() saveEdit = new EventEmitter<DiagnosisUpdateDto>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.applyMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['diagnosis'] && this.form) {
      this.applyMode();
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      grpGroup: ['', [Validators.maxLength(100)]],
    });
  }

  private applyMode(): void {
    if (this.mode === 'edit' && this.diagnosis) {
      this.form.patchValue({
        code: this.diagnosis.code ?? '',
        description: this.diagnosis.description ?? '',
        grpGroup: this.diagnosis.grpGroup ?? '',
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
      grpGroup?: string;
    };
    if (this.mode === 'create') {
      this.saveCreate.emit(value);
    } else {
      this.saveEdit.emit(value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  resetForm(): void {
    this.buildForm();
    this.applyMode();
  }
}
