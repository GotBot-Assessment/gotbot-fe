import { HttpClient } from '@angular/common/http';
import { Directive, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';
import { scrollToError } from '@gotbot-chef/shared/helpers/scroll-helper';
import { validateAllFormFields } from '@gotbot-chef/shared/helpers/validators';
import { UserModel } from '@gotbot-chef/shared/models/user.model';
import { TokenService } from '@gotbot-chef/shared/services/token.service';
import { LoadingStateService } from '@gotbot-chef/shared/services/ui/loading-state.service';
import { UserProfileService } from '@gotbot-chef/shared/services/user-profile.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, takeUntil, tap } from 'rxjs';

@Directive()
export abstract class AuthenticatesUserDirective extends HasObservablesDirective {
  protected readonly loadingStateService = inject(LoadingStateService);
  protected readonly httpClient = inject(HttpClient);
  protected readonly toastr = inject(ToastrService);
  protected readonly tokenService = inject(TokenService);
  protected readonly userProfileService = inject(UserProfileService);

  public abstract authForm: FormGroup;
  protected abstract authUrl: string;

  public authenticate(): void {
    if (this.authForm.invalid) {
      validateAllFormFields(this.authForm);

      return scrollToError();
    }

    this.loadingStateService.start(['processing', 'authenticate']);
    this.httpClient.post<{ token: string }>(this.authUrl, this.authForm.value)
      .pipe(
        tap(res => this.tokenService.setToken(res.token)),
        switchMap(() => this.httpClient.get<UserModel>('/gotbot/user')),
        finalize(() => this.loadingStateService.end(['processing', 'authenticate'])),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (user) => {
          this.userProfileService.setUser(user);

          return window.location.reload();
        },
        error: (err) => {
          return this.toastr.error(err.error?.message ?? err.message ?? 'Invalid credentials', 'Login failed');
        }
      });
  }
}
