import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '@gotbot-chef/shared/services/token.service';
import { UserProfileService } from '@gotbot-chef/shared/services/user-profile.service';

export const authenticationGuard = (shouldBeLoggedIn: boolean, redirectUrl: string): CanActivateFn => {
  return () => {
    const user = inject(UserProfileService).getUser();
    const token = inject(TokenService).getToken();
    const router = inject(Router);

    if (!!(user || token) === shouldBeLoggedIn) {
      return true;
    }

    return !router.navigate([redirectUrl]) as unknown as false;
  };
};
