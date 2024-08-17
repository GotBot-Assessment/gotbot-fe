import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'toFormGroup',
  standalone: true
})
export class ToFormGroupPipe implements PipeTransform {
  public transform(value: AbstractControl): FormGroup {
    return value as FormGroup;
  }
}
