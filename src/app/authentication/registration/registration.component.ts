import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthenticatesUserDirective } from '@gotbot-chef/authentication/authenticates-user.directive';
import { LoadingStateDirective } from '@gotbot-chef/shared/drirectives/loading-state.directive';
import { FormInputComponent } from '@gotbot-chef/shared/ui/form-input/form-input.component';

@Component({
  selector: 'gotbot-chef-registration',
  standalone: true,
  imports: [
    RouterLink,
    FormInputComponent,
    ReactiveFormsModule,
    LoadingStateDirective
  ],
  templateUrl: './registration.component.html'
})
export class RegistrationComponent extends AuthenticatesUserDirective {
  public readonly authForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    // eslint-disable-next-line camelcase
    password_confirmation: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });
  protected readonly authUrl = '/gotbot/auth/register';
}
