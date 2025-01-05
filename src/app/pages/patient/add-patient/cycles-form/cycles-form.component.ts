import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormControlStatusDirective } from '../../../../utils/directives/form-control-status.directive';
import { FormValidationMessagesComponent } from '../../../../utils/components/form-validation-messages/form-validation-messages.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Store } from '@ngrx/store';
import { PatientStoreSelectors, RootStoreState } from '../../../../root-store';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-cycles-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    FormControlStatusDirective,
    FormValidationMessagesComponent,
    ButtonDirective,
    Ripple,
  ],
  templateUrl: './cycles-form.component.html',
})
export class CyclesFormComponent implements OnInit, OnDestroy {
  @Input() nextCallbacks: any;
  @Input() previousCallbacks: any;
  @Output() sendValueForm = new EventEmitter<FormGroup>();
  cycleForm!: FormGroup;

  loadPatient$: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private readonly store: Store<RootStoreState.RootState>,
  ) {}

  ngOnInit(): void {
    this.cycleForm = this.fb.group({
      cycleNumber: [null, Validators.required],
      cycleDay: [null, Validators.required],
    });

    this.loadPatient$ = this.store
      .select(PatientStoreSelectors.selectPatient)
      .pipe(filter((patient) => !!patient))
      .subscribe({
        next: (patient) => {
          this.cycleForm.patchValue(patient);
        },
      });
  }

  nextCallback(): void {
    if (this.cycleForm.valid) {
      this.emitFormValues();
      this.nextCallbacks.emit();
    }
  }
  previousCallback(): void {
    this.previousCallbacks.emit();
  }

  emitFormValues(): void {
    this.sendValueForm.emit(this.cycleForm);
  }

  resetForm(): void {
    this.cycleForm.reset();
  }

  ngOnDestroy(): void {
    this.loadPatient$.unsubscribe();
  }
}
