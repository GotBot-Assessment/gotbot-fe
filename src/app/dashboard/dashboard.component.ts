import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HasObservablesDirective } from '@gotbot-chef/shared/drirectives/has-observables.directive';
import { DialogService } from '@gotbot-chef/shared/services/ui/dialog.service';

@Component({
  selector: 'gotbot-chef-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styles: ''
})
export class DashboardComponent extends HasObservablesDirective {
  private readonly httpClient = inject(HttpClient);
  private readonly dialogService = inject(DialogService);

  public logout(): void {
    console.log(this.httpClient, this.dialogService);
  }
}
