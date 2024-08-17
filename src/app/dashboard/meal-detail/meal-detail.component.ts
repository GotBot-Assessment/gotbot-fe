import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { afterNextRender, Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SaveMealComponent } from '@gotbot-chef/dashboard/save-meal/save-meal.component';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';
import { LoadingStateDirective } from '@gotbot-chef/shared/drirectives/loading-state.directive';
import { MealModel } from '@gotbot-chef/shared/models/meal.model';
import { DialogService } from '@gotbot-chef/shared/services/ui/dialog.service';
import { LoadingStateService } from '@gotbot-chef/shared/services/ui/loading-state.service';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { finalize, forkJoin, takeUntil } from 'rxjs';

@Component({
  selector: 'gotbot-chef-meal-detail',
  standalone: true,
  imports: [
    CurrencyPipe,
    LoadingStateDirective
  ],
  templateUrl: './meal-detail.component.html'
})
export class MealDetailComponent extends HasObservablesDirective {
  public readonly id = input.required<number>();
  public readonly meal = signal<MealModel | undefined>(undefined);
  public readonly formattedDate = computed(() => {
    if (this.meal()?.createdAt) {
      return moment(this.meal()?.createdAt).format('MMMM Do YYYY, h:mm a');
    }

    return undefined;
  });
  private readonly httpClient = inject(HttpClient);
  private readonly toasterService = inject(ToastrService);
  private readonly dialogService = inject(DialogService);
  private readonly loadingStateService = inject(LoadingStateService);
  private readonly router = inject(Router);
  private readonly modalService = inject(BsModalService);
  private modalRef?: BsModalRef;

  public constructor() {
    super();

    afterNextRender(() => this.fetchMealDetail());
  }

  public confirmMealDelete(): void {
    this.dialogService.open({
      message: 'You want to delete this meal item?',
      title: 'Are you sure?',
      actions: [
        {
          text: 'Cancel',
          class: 'btn-light',
          action: () => true
        }, {
          text: 'Yes, delete!',
          class: 'btn-danger',
          action: () => this.deleteMeal()
        }
      ]
    });
  }

  public openSaveMealDialog(): void {
    this.modalRef = this.modalService.show(SaveMealComponent, {
      class: 'modal-xl',
      initialState: { onSaveMeal: mealData => this.updateMeal(mealData) }
    });

    this.modalRef.content?.meal.set(this.meal()!);
  }

  private fetchMealDetail(): void {
    this.httpClient.get<MealModel>('/gotbot/meals/' + this.id())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: meal => this.meal.set(meal),
        error: (error) => this.toasterService.error(error.error?.message ?? error.message, 'Error')
      });
  }

  private deleteMeal(): boolean {
    this.loadingStateService.start(['processing', 'delete-meal']);

    this.httpClient.delete(`/gotbot/meals/${ this.meal()?.id }`)
      .pipe(
        finalize(() => this.loadingStateService.end(['processing', 'delete-meal'])),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (error) => this.toasterService.error(error.error?.message ?? error.message, 'Error')
      });

    return true;
  }

  private updateMeal(mealData: Record<string, any>): void {
    this.loadingStateService.start(['processing', 'save-meal']);

    const updateMeal$ = [this.httpClient.put(`/gotbot/meals/${ this.id() }`, mealData)];

    //updating meal image.
    if (mealData['image']) {
      const formData = new FormData();
      formData.append('image', mealData['image']);
      updateMeal$.push(this.httpClient.post(`/gotbot/meals/${ this.id() }`, formData));
    }

    //adding new ingredients.
    mealData['ingredients'].filter((ingredient: any) => !ingredient.id)
      .forEach((ingredient: any) => {
        updateMeal$.push(this.httpClient.post(`/gotbot/meals/${ this.id() }/ingredients`, { name: ingredient['name'] }));
      });

    //updating existing ingredients.
    mealData['ingredients'].filter((ingredient: any) => ingredient.id)
      .forEach((ingredient: any) => {
        updateMeal$.push(this.httpClient.put(`/gotbot/meals/${ this.id() }/ingredients/${ ingredient.id }`, { name: ingredient['name'] }));
      });

    //removing ingredients.
    const currentIngredientIds = this.meal()?.ingredients.map(ing => ing.id) ?? [];
    const updatingIngredientIds = mealData['ingredients'].filter((ingredient: any) => ingredient.id)
      .map((ingredient: any) => +ingredient.id);
    currentIngredientIds.filter(id => !updatingIngredientIds.includes(id))
      .forEach(ingredientId => updateMeal$.push(this.httpClient.delete(`/gotbot/meals/${ this.id() }/ingredients/${ ingredientId }`)));

    forkJoin(updateMeal$).pipe(
      finalize(() => this.loadingStateService.end(['processing', 'save-meal'])),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.modalRef?.hide();

        return this.fetchMealDetail();
      },
      error: (error) => this.toasterService.error(error.error?.message ?? error.message, 'Error')
    });
  }
}
