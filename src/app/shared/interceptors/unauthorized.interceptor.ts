import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(err => {
      if (err.status === 401) {
        err.error.message = 'You are unauthorized';

        localStorage.clear();
        sessionStorage.clear();

        window.location.reload();
      }

      return throwError(() => err);
    })
  );
};
