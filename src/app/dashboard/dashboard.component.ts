import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SaveFoodComponent } from '@gotbot-chef/dashboard/save-food/save-food.component';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';
import { DialogService } from '@gotbot-chef/shared/services/ui/dialog.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'gotbot-chef-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent extends HasObservablesDirective {
  private readonly httpClient = inject(HttpClient);
  private readonly dialogService = inject(DialogService);
  private readonly toasterService = inject(ToastrService);
  private readonly modalService = inject(BsModalService);

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

  public openSaveFoodDialog(): void {
    this.modalService.show(SaveFoodComponent, {
      class: 'modal-xl'
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
