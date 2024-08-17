import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { afterNextRender, Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SaveFoodComponent } from '@gotbot-chef/dashboard/save-food/save-food.component';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';
import { LoadingStateDirective } from '@gotbot-chef/shared/drirectives/loading-state.directive';
import { FoodModel } from '@gotbot-chef/shared/models/food.model';
import { DialogService } from '@gotbot-chef/shared/services/ui/dialog.service';
import { LoadingStateService } from '@gotbot-chef/shared/services/ui/loading-state.service';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { finalize, forkJoin, takeUntil } from 'rxjs';

@Component({
  selector: 'gotbot-chef-food-detail',
  standalone: true,
  imports: [
    CurrencyPipe,
    LoadingStateDirective
  ],
  templateUrl: './food-detail.component.html',
  styles: ''
})
export class FoodDetailComponent extends HasObservablesDirective {
  public readonly id = input.required<number>();
  public readonly food = signal<FoodModel | undefined>(undefined);
  public readonly formattedDate = computed(() => {
    if (this.food()?.createdAt) {
      return moment(this.food()?.createdAt).format('MMMM Do YYYY, h:mm a');
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

    afterNextRender(() => this.fetchFoodDetail());
  }

  public confirmFoodDelete(): void {
    this.dialogService.open({
      message: 'You want to delete this food item?',
      title: 'Are you sure?',
      actions: [
        {
          text: 'Cancel',
          class: 'btn-light',
          action: () => true
        }, {
          text: 'Yes, delete!',
          class: 'btn-danger',
          action: () => this.deleteFood()
        }
      ]
    });
  }

  public openSaveFoodDialog(): void {
    this.modalRef = this.modalService.show(SaveFoodComponent, {
      class: 'modal-xl',
      initialState: {
        isCreate: false,
        onSaveFood: foodData => this.updateFood(foodData)
      }
    });

    this.modalRef.content?.food.set(this.food()!);
  }

  private fetchFoodDetail(): void {
    this.httpClient.get<FoodModel>('/gotbot/foods/' + this.id())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: food => this.food.set(food),
        error: (error) => this.toasterService.error(error.error?.message ?? error.message, 'Error')
      });
  }

  private deleteFood(): boolean {
    this.loadingStateService.start(['processing', 'delete-food']);

    this.httpClient.delete(`/gotbot/foods/${ this.food()?.id }`)
      .pipe(
        finalize(() => this.loadingStateService.end(['processing', 'delete-food'])),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (error) => this.toasterService.error(error.error?.message ?? error.message, 'Error')
      });

    return true;
  }

  private updateFood(foodData: Record<string, any>): void {
    this.loadingStateService.start(['processing', 'save-food']);

    const updateFood$ = [this.httpClient.put(`/gotbot/foods/${ this.id() }`, foodData)];

    //updating food image.
    if (foodData['image']) {
      const formData = new FormData();
      formData.append('image', foodData['image']);
      updateFood$.push(this.httpClient.post(`/gotbot/foods/${ this.id() }`, formData));
    }

    //adding new ingredients.
    foodData['ingredients'].filter((ingredient: any) => !ingredient.id)
      .forEach((ingredient: any) => {
        updateFood$.push(this.httpClient.post(`/gotbot/foods/${ this.id() }/ingredients`, { name: ingredient['name'] }));
      });

    //updating existing ingredients.
    foodData['ingredients'].filter((ingredient: any) => ingredient.id)
      .forEach((ingredient: any) => {
        updateFood$.push(this.httpClient.put(`/gotbot/foods/${ this.id() }/ingredients/${ ingredient.id }`, { name: ingredient['name'] }));
      });

    //removing ingredients.
    const currentIngredientIds = this.food()?.ingredients.map(ing => ing.id) ?? [];
    const updatingIngredientIds = foodData['ingredients'].filter((ingredient: any) => ingredient.id)
      .map((ingredient: any) => +ingredient.id);
    currentIngredientIds.filter(id => !updatingIngredientIds.includes(id))
      .forEach(ingredientId => updateFood$.push(this.httpClient.delete(`/gotbot/foods/${ this.id() }/ingredients/${ ingredientId }`)));

    forkJoin(updateFood$).pipe(
      finalize(() => this.loadingStateService.end(['processing', 'save-food'])),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.modalRef?.hide();

        return this.fetchFoodDetail();
      },
      error: (error) => this.toasterService.error(error.error?.message ?? error.message, 'Error')
    });
  }
}
