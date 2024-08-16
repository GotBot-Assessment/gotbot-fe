import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors
} from '@angular/forms';


/**
 * Marks the form group controls as marked so validation classes can be added.
 *
 * @param {FormGroup | FormArray} formGroup
 */
export function validateAllFormFields(formGroup: UntypedFormGroup | UntypedFormArray): void {
  Object.keys(formGroup.controls).forEach((field) => {
    const control = formGroup.get(field);
    if (control instanceof UntypedFormControl) {
      validateFormField(control);
    } else if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
      validateAllFormFields(control);
    }
  });
}

/**
 * Marks touched on a single form control.
 *
 * @param {FormControl} control
 */
export function validateFormField(control: UntypedFormControl): void {
  control.markAsTouched({ onlySelf: true });
}

export function getValidationRules(control: AbstractControl): ValidationErrors | null {
  return control.validator ? control.validator({} as AbstractControl) : {};
}

/**
 * Checks if this control has a required validation rule.
 * @param control
 */
export function isRequired(control: AbstractControl): boolean {
  const validationRules = getValidationRules(control);

  return !!validationRules && !!validationRules['required'];
}
