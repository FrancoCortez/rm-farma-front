import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function minLengthArray(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control && control instanceof FormArray) {
      return control.length >= min ? null : { minLengthArray: true };
    }
    return null;
  };
}
