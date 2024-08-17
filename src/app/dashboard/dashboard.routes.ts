import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@gotbot-chef/dashboard/dashboard.component')
      .then((m) => m.DashboardComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@gotbot-chef/dashboard/list-foods/list-foods.component')
          .then((m) => m.ListFoodsComponent)
      }
    ]
  }
];
