import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withHashLocation, withViewTransitions } from '@angular/router';
import { routes } from '@gotbot-chef/app.routes';
import { httpCallsProgressInterceptor } from '@gotbot-chef/shared/interceptors/http-calls-progress.interceptor';
import { jwtInterceptor } from '@gotbot-chef/shared/interceptors/jwt.interceptor';
import { unauthorizedInterceptor } from '@gotbot-chef/shared/interceptors/unauthorized.interceptor';
import { unprocessableEntityInterceptor } from '@gotbot-chef/shared/interceptors/unprocessable-entity.interceptor';
import { urlAdjusterInterceptor } from '@gotbot-chef/shared/interceptors/url-adjuster.interceptors';
import { LocalStorageService } from '@gotbot-chef/shared/services/storage/local-storage.service';
import { StorageService } from '@gotbot-chef/shared/services/storage/storage.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withHashLocation()
    ),
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        urlAdjusterInterceptor,
        httpCallsProgressInterceptor,
        jwtInterceptor,
        unprocessableEntityInterceptor,
        unauthorizedInterceptor
      ])
    ),
    provideToastr(),
    importProvidersFrom(ModalModule.forRoot()),
    {
      provide: StorageService,
      useClass: LocalStorageService
    }
  ]
};
