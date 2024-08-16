import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerService } from '@gotbot-chef/shared/services/ui/spinner.service';
import { finalize } from 'rxjs';

export const httpCallsProgressInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);
  spinnerService.incrementHttpCallsCount();

  return next(req).pipe(
    finalize(() => spinnerService.decrementHttpCallsCount())
  );
};
