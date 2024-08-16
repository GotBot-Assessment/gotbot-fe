import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withHashLocation, withViewTransitions } from '@angular/router';

import { routes } from '@gotbot-chef/app.routes';
import { urlAdjusterInterceptor } from '@gotbot-chef/shared/interceptors/url-adjuster.interceptors';
import { ModalModule } from 'ngx-bootstrap/modal';

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
        urlAdjusterInterceptor
      ])
    ),
    importProvidersFrom(ModalModule.forRoot())
  ]
};
