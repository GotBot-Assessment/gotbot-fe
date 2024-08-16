import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@environments/environment';

export const urlAdjusterInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(req.url);
  if (req.url.startsWith('/gotbot')) {
    req = req.clone({
      url: `${ environment.apiUrl }${ req.url.replace('gotbot/', 'api/') }`
    });
  }

  return next(req);
};
