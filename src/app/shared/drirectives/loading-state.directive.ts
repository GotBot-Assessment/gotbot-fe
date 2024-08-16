import { AfterViewInit, Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { LoadingStateService } from '@gotbot-chef/shared/services/ui/loading-state.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[gotbotChefLoadingState]',
  standalone: true
})
export class LoadingStateDirective implements AfterViewInit, OnDestroy {
  public aliasList = input.required<string | string[]>({
    alias: 'gotbotChefLoadingState'
  });

  private stateSub!: Subscription;

  private readonly element = inject(ElementRef);
  private readonly loadingStateService = inject(LoadingStateService);

  public ngAfterViewInit(): void {
    this.stateSub = this.loadingStateService.on(this.aliasList()).subscribe({
      next: change => change ? this.loadingOn() : this.loadingOff()
    });
  }

  public ngOnDestroy(): void {
    this.stateSub?.unsubscribe();
  }

  /**
   * Disables the input and add the 'loading-state' class.
   */
  private loadingOn(): void {
    if (this.element.nativeElement.disabled) {
      this.element.nativeElement.classList.add('previously-disabled');
    }
    this.element.nativeElement.setAttribute('disabled', true);
    this.element.nativeElement.classList.add('loading-state');
  }

  /**
   * Enables the input and remove the 'loading-state' class.
   */
  private loadingOff(): void {
    if (this.element.nativeElement.classList.contains('previously-disabled')) {
      this.element.nativeElement.classList.remove('previously-disabled');

      return this.element.nativeElement.classList.remove('loading-state');
    }
    this.element.nativeElement.removeAttribute('disabled');
    this.element.nativeElement.classList.remove('loading-state');
  }
}
