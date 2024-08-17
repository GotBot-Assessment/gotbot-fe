import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { afterNextRender, Component, effect, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';
import { PaginatedResponse } from '@gotbot-chef/shared/models/api.response';
import { MealModel } from '@gotbot-chef/shared/models/meal.model';
import { PageChangedEvent, PaginationComponent, PaginationModule } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'gotbot-chef-list-meals',
  standalone: true,
  imports: [
    PaginationModule,
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './list-meals.component.html',
  styles: [':host {display: block}']
})
export class ListMealsComponent extends HasObservablesDirective {
  public readonly pagination = viewChild(PaginationComponent);
  public readonly paginatedMeals = signal<PaginatedResponse<MealModel> | undefined>(undefined);
  public readonly currentPage = signal(1);
  private readonly httpClient = inject(HttpClient);
  private readonly toastrService = inject(ToastrService);

  public constructor() {
    super();

    afterNextRender(() => this.getMeals());

    effect(() => {
      if (this.pagination() && this.currentPage()) {
        this.pagination()!.page = this.currentPage();
      }
    });
  }

  public pageChanged(event: PageChangedEvent): void {
    this.currentPage.set(event.page);
    this.getMeals();
  }

  private getMeals(): void {
    this.httpClient.get<PaginatedResponse<MealModel>>('/gotbot/meals', {
      params: { page: this.currentPage() }
    }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.paginatedMeals.set(response),
        error: (error) => this.toastrService.error(error.error?.message ?? error.message, 'Error')
      });
  }
}
