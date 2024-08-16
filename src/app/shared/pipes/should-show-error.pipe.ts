import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { shouldShowError } from '@gotbot-chef/shared/helpers/forms';

@Pipe({
  name: 'shouldShowError',
  standalone: true,
  pure: false
})
export class ShouldShowErrorPipe implements PipeTransform {

  public transform(formGroup: AbstractControl, controlName: string, errorKey = 'required'): boolean {
    return shouldShowError(formGroup, controlName, errorKey);
  }
}
