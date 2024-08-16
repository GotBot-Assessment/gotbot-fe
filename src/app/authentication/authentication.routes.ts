import { Routes } from '@angular/router';
import { authenticationGuard } from '@gotbot-chef/shared/guards/authentication.guard';

export const authenticationRoutes: Routes = [
  {
    path: '',
    canActivate: [authenticationGuard(false, '/dashboard')],
    loadComponent: () => import('@gotbot-chef/authentication/authentication.component')
      .then((m) => m.AuthenticationComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@gotbot-chef/authentication/login/login.component')
          .then((m) => m.LoginComponent)
      }, {
        path: 'registration',
        loadComponent: () => import('@gotbot-chef/authentication/registration/registration.component')
          .then(c => c.RegistrationComponent)
      }
    ]
  }
];
