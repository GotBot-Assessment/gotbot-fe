import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { scrollToSelector } from '@gotbot-chef/shared/helpers/scroll-helper';
import { ValidationErrorsService } from '@gotbot-chef/shared/services/validation-errors.service';
import { catchError, throwError } from 'rxjs';

export const unprocessableEntityInterceptor: HttpInterceptorFn = (req, next) => {
  const validationErrorsService = inject(ValidationErrorsService);

  if (req.method !== 'GET') {
    validationErrorsService.resetErrors();
  }

  return next(req).pipe(
    catchError(err => {
      if (err.status === 422) {
        validationErrorsService.pushErrors(err.error?.errors ?? err.error?.message);
        scrollToSelector('.server-error');

        if (Array.isArray(err.error?.errors)) {
          err.error.message = Object.values(err.error.errors)
            .flat()
            .join('\n');
        }
      }

      if (err.status === 401) {
        err.error.message = 'You are unauthorized';
      }

      return throwError(() => err);
    })
  );
};
