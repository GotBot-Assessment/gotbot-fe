import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';

@Component({
  selector: 'gotbot-chef-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent extends HasObservablesDirective{
  public readonly loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });
}
