import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerService } from '@gotbot-chef/shared/services/ui/spinner.service';

@Component({
  selector: 'gotbot-chef-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public readonly spinnerService = inject(SpinnerService);
  private readonly cdr = inject(ChangeDetectorRef);

  public constructor() {
    effect(() => {
      this.spinnerService.httpCallsCount();

      return this.cdr.detectChanges();
    });
  }
}
