import { HttpClient } from '@angular/common/http';
import { afterNextRender, Component, inject } from '@angular/core';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';
import { PaginatedResponse } from '@gotbot-chef/shared/models/api.response';
import { FoodModel } from '@gotbot-chef/shared/models/food.model';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'gotbot-chef-list-foods',
  standalone: true,
  imports: [],
  templateUrl: './list-foods.component.html',
})
export class ListFoodsComponent extends HasObservablesDirective {
  private readonly httpClient = inject(HttpClient);
  private readonly toastrService = inject(ToastrService);

  public constructor() {
    super();

    afterNextRender(() => this.getMeals());
  }

  private getMeals(): void {
    this.httpClient.get<PaginatedResponse<FoodModel>>('/gotbot/foods')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => this.toastrService.error(error.error?.message ?? error.message, 'Error')
      });
  }
}
