import { AbstractControl, FormControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

/**
 * This TypeScript function checks if a specific error should be shown for a given form control.
 * @param {AbstractControl} formGroup - An instance of the Angular AbstractControl class that
 * represents a group of form controls. It can be a FormGroup, FormArray, or FormControl.
 * @param {string} controlName - The name of the form control for which we want to check if an error
 * should be shown.
 * @param {string} [errorKey=required] - The `errorKey` parameter is a string that represents the
 * specific error that we want to check for in the form control. In this case, the default value is set
 * to `'required'`, which means that the function will check if the form control has a required error.
 * However, this parameter can
 * @returns The function `shouldShowError` returns a boolean value. It checks if the specified
 * `formGroup` has a control with the given `controlName` that has an error with the specified
 * `errorKey`. If such an error exists and the control has been touched, the function returns `true`.
 * Otherwise, it returns `false`.
 */
export function shouldShowError(formGroup: AbstractControl, controlName: string, errorKey = 'required'): boolean {
  if (formGroup instanceof FormControl || formGroup instanceof UntypedFormControl) {
    return formGroup?.errors?.[errorKey] && formGroup.touched;
  }

   
  return (formGroup as UntypedFormGroup).controls[controlName]?.errors?.[errorKey] && (formGroup as UntypedFormGroup).controls[controlName].touched;
}

/**
 * This TypeScript function checks if a control is nested within a form group.
 * @param {AbstractControl} formGroup - The formGroup parameter is an instance of the AbstractControl
 * class, which represents a group of form controls in Angular. It can contain one or more form
 * controls, such as input fields, checkboxes, and radio buttons. The formGroup parameter is used to
 * access the nested form group that contains the control we
 * @param {string} controlName - controlName is a string parameter that represents the name of the
 * control that we want to check for existence within a nested form group.
 * @param {string[]} groupNames - `groupNames` is a rest parameter that allows the function to accept
 * any number of additional string arguments. These arguments represent the names of nested form groups
 * that need to be traversed to reach the desired control. For example, if the control is nested inside
 * a form group called "address" which is
 * @returns The function `hasNestedControl` returns a boolean value indicating whether a nested form
 * control with the specified `controlName` exists within the nested form group hierarchy specified by
 * `formGroup` and `groupNames`.
 */
export function hasNestedControl(formGroup: AbstractControl, controlName: string, ...groupNames: string[]): boolean {
  return !!getNestedFormGroup(formGroup as UntypedFormGroup, ...groupNames).controls[controlName];
}

/**
 * This TypeScript function returns a nested form group based on the parent form and control names.
 * @param {UntypedFormGroup} parentForm - The parent form is an instance of the `UntypedFormGroup`
 * class, which is a type of Angular `FormGroup` that allows for dynamic creation of form controls and
 * validation rules. It serves as the container for a group of related form controls.
 * @param {string[]} controlNames - `controlNames` is a rest parameter that allows the function to
 * accept any number of string arguments. These string arguments represent the names of the nested form
 * controls that need to be accessed. The function will use these control names to traverse the nested
 * form group and return the final nested form group that matches the
 * @returns The function `getNestedFormGroup` returns an `UntypedFormGroup` which is a nested form
 * group obtained by iterating over the `controlNames` array and accessing each control in the parent
 * form group `parentForm`. The final control in the array is returned as the nested form group.
 */
export function getNestedFormGroup(parentForm: UntypedFormGroup, ...controlNames: string[]): UntypedFormGroup {
  return controlNames.reduce((prevForm, curCtl) => {
    return prevForm.controls[curCtl] as UntypedFormGroup;
  }, parentForm);
}

/**
 * This TypeScript function returns a nested form array from a parent form group based on the provided
 * control name and group names.
 * @param {UntypedFormGroup} parentForm - The parent form is an instance of the UntypedFormGroup class,
 * which represents a group of form controls in Angular. It contains one or more child controls, which
 * can be either form groups or form controls. The parent form is typically created using the
 * FormBuilder service in Angular.
 * @param {string} controlName - The name of the form control that is part of the nested form array.
 * @param {string[]} groupNames - `groupNames` is a rest parameter that allows for an arbitrary number
 * of string arguments to be passed in. These strings represent the names of nested form groups that
 * need to be traversed in order to access the desired form array. For example, if `groupNames` is
 * `['address', '
 * @returns The function `getNestedFormArray` is returning an `UntypedFormArray`. This is obtained by
 * calling the `getNestedFormGroup` function with the `parentForm` and `groupNames` arguments, and then
 * accessing the `controls` property of the resulting `UntypedFormGroup` object with the `controlName`
 * argument. The `as UntypedFormArray` syntax is used to cast
 */
export function getNestedFormArray(parentForm: UntypedFormGroup, controlName: string, ...groupNames: string[]): UntypedFormArray {
  return getNestedFormGroup(parentForm, ...groupNames).controls[controlName] as UntypedFormArray;
}

/**
 * This TypeScript function returns a nested form control given a parent form, control name, and any
 * number of group names.
 * @param {AbstractControl} parentForm - An instance of the AbstractControl class, which represents a
 * form control or a group of form controls.
 * @param {string} controlName - The name of the control that you want to retrieve from the nested form
 * group.
 * @param {string[]} groupNames - `groupNames` is a rest parameter that allows for an arbitrary number
 * of string arguments to be passed in. These strings represent the names of nested FormGroup controls
 * that need to be traversed in order to access the desired FormControl. For example, if `groupNames`
 * is `['address', 'city
 * @returns The function `getNestedFormControl` returns an `UntypedFormControl` object that represents
 * a form control nested within one or more `UntypedFormGroup` objects. The form control is identified
 * by its name (`controlName`) and the names of the parent form groups (`groupNames`). The function
 * takes an `AbstractControl` object (`parentForm`) as input, which is cast to an `Untyped
 */
export function getNestedFormControl(parentForm: AbstractControl, controlName: string, ...groupNames: string[]): UntypedFormControl {
  return getNestedFormGroup(parentForm as UntypedFormGroup, ...groupNames).controls[controlName] as UntypedFormControl;
}
