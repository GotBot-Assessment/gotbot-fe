import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidationErrorsService {
  private readonly errorsSubject = new BehaviorSubject<LaravelValidationErrors>({});
  private readonly error$ = this.errorsSubject.asObservable();

  public pushErrors(errors: LaravelValidationErrors): void {
    return this.errorsSubject.next(errors);
  }

  public onErrors(): Observable<LaravelValidationErrors> {
    return this.error$;
  }

  public resetErrors(): void {
    this.errorsSubject.next({});
  }

  public removeError(key: string): void {
    const errors = this.errorsSubject.value;
    delete errors[key];

    this.pushErrors(errors);
  }
}

type LaravelValidationErrors = Record<string, string[]>;
