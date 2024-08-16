import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';
import { FormInputComponent } from '@gotbot-chef/shared/ui/form-input/form-input.component';

@Component({
  selector: 'gotbot-chef-registration',
  standalone: true,
  imports: [
    RouterLink,
    FormInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './registration.component.html'
})
export class RegistrationComponent extends HasObservablesDirective {
  public readonly registrationForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    password_confirmation: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });
}
