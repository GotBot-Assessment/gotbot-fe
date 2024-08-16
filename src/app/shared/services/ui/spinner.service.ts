import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  public readonly httpCallsCount = signal<number>(0);

  public incrementHttpCallsCount(): void {
    return this.httpCallsCount.update(count => {
      return count + 1;
    });
  }

  public decrementHttpCallsCount(): void {
    return this.httpCallsCount.update(count => {
      return count - 1;
    });
  }
}
