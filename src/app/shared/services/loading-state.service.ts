import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingStateService {
  public loadingMessage = 'Please wait...';

  /**
   * Replay the last 10 loading states to ensure components are up to date with their correct loading state when subscribe
   * @type {ReplaySubject<string>}
   */
  private readonly loadingStates$ = new ReplaySubject<{ alias: string; state: boolean }>(10);

  /**
   * @readonly
   * @type {Observable<{ alias: string; state: boolean }>}
   */
  public get loadingStates(): Observable<{ alias: string; state: boolean }> {
    return this.loadingStates$.asObservable();
  }

  /**
   * Starts the loading service and disable inputs.
   *
   * @param {string} alias
   * @param message
   */
  public start(alias: string | string[], message = 'Please wait ...'): void {
    alias = alias instanceof Array ? alias : [alias];

    //assign loader message.
    this.loadingMessage = message;

    alias.forEach(alias => {
      this.loadingStates$.next({
        alias,
        state: true
      });
    });
  }

  /**
   * Ends the loading service and enable the inputs.
   *
   * @param {string} alias
   */
  public end(alias: string | string[]): void {
    alias = alias instanceof Array ? alias : [alias];

    alias.forEach(alias => {
      this.loadingStates$.next({
        alias,
        state: false
      });
    });
  }

  /**
   * helper method to filter listening events to those required
   * @param {string} alias
   * @returns {Observable<boolean>}
   */
  public on(alias: string | string[]): Observable<boolean> {
    alias = alias instanceof Array ? alias : [alias];

    return this.loadingStates.pipe(
      filter((stateChange: { alias: string; state: boolean }) => alias.includes(stateChange.alias)),
      map(stateChange => stateChange.state)
    );
  }
}
