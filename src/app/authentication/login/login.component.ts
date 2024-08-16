import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';
import { scrollToError } from '@gotbot-chef/shared/helpers/scroll-helper';
import { validateAllFormFields } from '@gotbot-chef/shared/helpers/validators';
import { LoadingStateService } from '@gotbot-chef/shared/services/ui/loading-state.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'gotbot-chef-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent extends HasObservablesDirective {
  public readonly loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });
  private readonly loadingStateService = inject(LoadingStateService);
  private readonly httpClient = inject(HttpClient);
  private readonly toastr = inject(ToastrService);

  public login(): void {
    if (this.loginForm.invalid) {
      validateAllFormFields(this.loginForm);

      return scrollToError();
    }

    this.loadingStateService.start('processing');
    this.httpClient.post('/gotbot/auth/login', this.loginForm.value)
      .pipe(
        finalize(() => this.loadingStateService.end('processing')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => window.location.reload(),
        error: (err) => {
          this.loginForm.controls.password.setValue(null);

          return this.toastr.error(err.message ?? 'Invalid credentials', 'Login failed');
        }
      });
  }
}
