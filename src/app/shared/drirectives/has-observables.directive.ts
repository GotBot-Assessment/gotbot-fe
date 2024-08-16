import { DestroyRef, Directive, inject, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Directive()
export class HasObservablesDirective implements OnDestroy {
  protected subscription?: Subscription;
  protected readonly subscriptions: Subscription[] = [];
  protected readonly destroy$ = new Subject<void>();
  protected readonly destroyRef = inject(DestroyRef);

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    if (this.subscriptions.length) {
      this.subscriptions.forEach(subscription => {
        if (subscription && !subscription.closed) {
          subscription.unsubscribe();
        }
      });
    }
  }
}
