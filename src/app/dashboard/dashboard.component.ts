import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SaveMealComponent } from '@gotbot-chef/dashboard/save-meal/save-meal.component';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';
import { MealModel } from '@gotbot-chef/shared/models/meal.model';
import { DialogService } from '@gotbot-chef/shared/services/ui/dialog.service';
import { LoadingStateService } from '@gotbot-chef/shared/services/ui/loading-state.service';
import { UserProfileService } from '@gotbot-chef/shared/services/user-profile.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { finalize, forkJoin, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'gotbot-chef-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends HasObservablesDirective {
  public readonly userProfile = inject(UserProfileService).getUser();
  private readonly httpClient = inject(HttpClient);
  private readonly dialogService = inject(DialogService);
  private readonly toasterService = inject(ToastrService);
  private readonly modalService = inject(BsModalService);
  private readonly loadingStateService = inject(LoadingStateService);
  private readonly router = inject(Router);
  private modalRef?: BsModalRef;

  public logout(): void {
    this.dialogService.open({
      message: 'You want to log out?',
      title: 'Are you sure?',
      actions: [
        {
          text: 'Cancel',
          class: 'btn-light',
          action: () => true
        }, {
          text: 'Yes, logout!',
          class: 'btn-danger',
          action: () => this.makeLogoutRequest()
        }
      ]
    });
  }

  public openSaveMealDialog(): void {
    this.modalRef = this.modalService.show(SaveMealComponent, {
      class: 'modal-xl',
      initialState: { onSaveMeal: mealData => this.saveMeal(mealData) }
    });
  }

  private saveMeal(mealData: Record<string, any>): void {
    this.loadingStateService.start(['processing', 'save-meal']);

    this.httpClient.post<MealModel>('/gotbot/meals', mealData)
      .pipe(
        switchMap(meal => {
          const formData = new FormData();
          formData.append('image', mealData['image']);

          return forkJoin([
            this.httpClient.post(`/gotbot/meals/${ meal.id }`, formData),
            //map create ingredients.
            ...mealData['ingredients'].map((ingredient: any) => {
              return this.httpClient.post(`/gotbot/meals/${ meal.id }/ingredients`, { name: ingredient['name'] });
            })
          ]);
        }),
        finalize(() => this.loadingStateService.end(['processing', 'save-meal'])),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          const [, ingredient] = res as Array<any>;
          this.modalRef?.hide();

          return this.router.navigate(['/dashboard', ingredient.mealId])
            .then(() => window.location.reload());
        },
        error: (error) => this.toasterService.error(error.error?.message ?? error.message, 'Error')
      });
  }

  private makeLogoutRequest(): boolean {
    this.httpClient.get('/gotbot/auth/logout')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          localStorage.clear();
          sessionStorage.clear();

          return window.location.reload();
        },
        error: (error) => this.toasterService.error(error.error?.message ?? error.message, 'Error')
      });

    return true;
  }
}
