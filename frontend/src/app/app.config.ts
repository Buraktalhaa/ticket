import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { notificationInterceptor } from './shared/interceptors/notification.interceptor';
import { authInterceptor } from './shared/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(
      { eventCoalescing: true }),
      provideRouter(routes),
      provideAnimationsAsync(),
      provideHttpClient(withInterceptors([
        notificationInterceptor,
        authInterceptor
      ])),
      CookieService
    ]
};
