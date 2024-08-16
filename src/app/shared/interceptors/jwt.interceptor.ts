import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '@gotbot-chef/shared/services/token.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  req = req.clone({
    setHeaders: {
      'Accept': 'application/json'
    }
  });

  if (tokenService.getToken()) {
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${ tokenService.getToken() }`
      }
    });
  }

  return next(req);
};
