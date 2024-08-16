import { Routes } from '@angular/router';
import { authenticationRoutes } from '@gotbot-chef/authentication/authentication.routes';
import { authenticationGuard } from '@gotbot-chef/shared/guards/authentication.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'authentication',
    pathMatch: 'full'
  }, {
    path: 'authentication',
    children: authenticationRoutes,
    canActivate: [authenticationGuard(false, '/dashboard')],
  }
];
