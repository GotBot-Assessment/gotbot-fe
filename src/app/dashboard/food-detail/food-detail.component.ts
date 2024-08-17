import { HttpClient } from '@angular/common/http';
import { afterNextRender, Component, inject, input, signal } from '@angular/core';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';
import { FoodModel } from '@gotbot-chef/shared/models/food.model';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'gotbot-chef-food-detail',
  standalone: true,
  imports: [],
  templateUrl: './food-detail.component.html',
  styles: ''
})
export class FoodDetailComponent extends HasObservablesDirective {
  public readonly id = input.required<number>();
  public readonly food = signal<FoodModel | undefined>(undefined);
  private readonly httpClient = inject(HttpClient);
  private readonly toasterService = inject(ToastrService);

  public constructor() {
    super();

    afterNextRender(() => this.fetchFoodDetail());
  }

  private fetchFoodDetail(): void {
    this.httpClient.get<FoodModel>('/gotbot/foods/' + this.id())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: food => this.food.set(food),
        error: (error) => this.toasterService.error(error.error?.message ?? error.message, 'Error')
      });
  }
}
