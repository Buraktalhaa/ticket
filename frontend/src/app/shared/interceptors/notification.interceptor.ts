import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    tap(
      (event) => {
        if (event instanceof HttpResponse) {
          const body: any = event.body;
          if (body.error) {
            return notificationService.showNotification(
              'error',
              body.error.message,
            );
          }
          console.log(body.message);
          const message = body.data?.message;
          
          if (message) notificationService.showNotification('success', message);
        }
      },
      (error) => {
        console.log(error.error);
        return notificationService.showNotification(
          'error',
          error.error.message,
        );
      },
    ),
  );
};
