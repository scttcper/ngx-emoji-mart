import { bootstrapApplication } from '@angular/platform-browser';

import { setupGoogleAnalytics } from './ga';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Do not enable any tracking until it's deployed to Vercel.
if (environment.vercel) {
  setupGoogleAnalytics();
}

bootstrapApplication(AppComponent, appConfig);
