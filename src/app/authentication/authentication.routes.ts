import { Routes } from '@angular/router';

export const authenticationRoutes: Routes = [
  {
    path: '',
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
