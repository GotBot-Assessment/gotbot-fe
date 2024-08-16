import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';
import { scrollToError } from '@gotbot-chef/shared/helpers/scroll-helper';
import { validateAllFormFields } from '@gotbot-chef/shared/helpers/validators';
import { UserModel } from '@gotbot-chef/shared/models/user.model';
import { TokenService } from '@gotbot-chef/shared/services/token.service';
import { LoadingStateService } from '@gotbot-chef/shared/services/ui/loading-state.service';
import { UserProfileService } from '@gotbot-chef/shared/services/user-profile.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, takeUntil, tap } from 'rxjs';

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
  private readonly tokenService = inject(TokenService);
  private readonly userProfileService = inject(UserProfileService);

  public login(): void {
    if (this.loginForm.invalid) {
      validateAllFormFields(this.loginForm);

      return scrollToError();
    }

    this.loadingStateService.start('processing');
    this.httpClient.post<{ token: string }>('/gotbot/auth/login', this.loginForm.value)
      .pipe(
        tap(res => this.tokenService.setToken(res.token)),
        switchMap(() => this.httpClient.get<UserModel>('/gotbot/user')),
        finalize(() => this.loadingStateService.end('processing')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (user) => {
          this.userProfileService.setUser(user);

          return window.location.reload();
        },
        error: (err) => {
          this.loginForm.controls.password.setValue(null);

          return this.toastr.error(err.message ?? 'Invalid credentials', 'Login failed');
        }
      });
  }
}
