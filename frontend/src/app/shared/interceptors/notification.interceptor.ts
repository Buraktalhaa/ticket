import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const body: any = event.body;

        if (body?.error) {
          notificationService.showNotification('error', body.error.message);
          return;
        }

        const message = body.data?.message || body.message;
        if (message) {
          notificationService.showNotification('success', message);
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const message = error?.error?.message;
      if (message) {
        notificationService.showNotification('error', message);
      }
      return throwError(() => error);
    })
  );
};
