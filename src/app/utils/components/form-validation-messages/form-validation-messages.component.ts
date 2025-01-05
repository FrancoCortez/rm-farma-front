import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-form-validation-messages',
  standalone: true,
  imports: [NgIf],
  templateUrl: './form-validation-messages.component.html',
})
export class FormValidationMessagesComponent {
  @Input() control!: AbstractControl | null;
  @Input() message: string = '';
  @Input() errorType: string = '';
}
