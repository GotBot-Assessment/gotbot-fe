import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@gotbot-chef/app.config';
import { AppComponent } from '@gotbot-chef/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
