import { CanActivateFn } from '@angular/router';

export const authenticationGuard = (shouldBeLoggedIn: boolean, redirectUrl: string): CanActivateFn => {
  return () => {
    //TODO: check user authentication.
    console.log(shouldBeLoggedIn, redirectUrl);

    return true;
  };
};
