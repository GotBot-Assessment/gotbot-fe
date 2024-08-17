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
import { finalize, takeUntil } from 'rxjs';

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
      initialState: { onSaveFood: foodData => this.updateFood(foodData) }
    });
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

  private updateFood(foodData: Record<string, any>): boolean {
    console.log(foodData, this.modalRef);

    return true;
  }
}
