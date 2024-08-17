import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@gotbot-chef/dashboard/dashboard.component')
      .then((m) => m.DashboardComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('@gotbot-chef/dashboard/list-meals/list-meals.component')
          .then((m) => m.ListMealsComponent)
      }, {
        path: ':id',
        loadComponent: () => import('@gotbot-chef/dashboard/meal-detail/meal-detail.component')
          .then(c => c.MealDetailComponent)
      }
    ]
  }
];
