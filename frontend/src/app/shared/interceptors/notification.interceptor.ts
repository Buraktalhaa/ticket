import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const body: any = event.body;

        if (body?.error) {
          notificationService.error(body.error.message);
          return;
        }

        const message = body.data?.message || body.message;
        if (message) {
          notificationService.success(message);
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const message = error?.error?.message;
      const isAuthRequest = req.url.includes('/auth/sign-in') || req.url.includes('/auth/refresh');
    
      if (typeof message === 'string') {
        notificationService.error(message);
      }
    
      if ((error.status === 401 || error.status === 403) && !isAuthRequest) {
        router.navigate(['/unauthorized']);
      }
    
      return throwError(() => error);
    })    
  );
};
