import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../types/api-response.types';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    tap((event) => {
      // basarili bir mesaj gelmis
      if (event instanceof HttpResponse) {
        const body = event.body as ApiResponse;

        const message = body.message;
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
