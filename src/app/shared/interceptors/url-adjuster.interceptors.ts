import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@environments/environment';

export const urlAdjusterInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/gotbot') && environment.production) {
    req = req.clone({
      url: `${ environment.apiUrl }${ req.url.replace('gotbot/', '') }`
    });
  }

  return next(req);
};
