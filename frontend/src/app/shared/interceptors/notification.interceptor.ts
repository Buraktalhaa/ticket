import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);
  const apiService = inject(ApiService);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const body: any = event.body;

        if (body.error) {
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
      const status = error?.status;
      const message = error?.error?.message;

      if (status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          notificationService.showNotification('error', 'Please log in again.');
          router.navigateByUrl('/signin');
          return throwError(() => error);
        }

        return apiService.post('http://localhost:3000/auth/refresh', { refreshToken }).pipe(
          switchMap((res: any) => {
            if (res.accessToken) {
              localStorage.setItem('accessToken', res.accessToken);
              notificationService.showNotification('success', 'Session renewed successfully.');

              // Orijinal isteği yeni token ile tekrar et
              const clonedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${res.accessToken}`),
              });
              return next(clonedReq);
            } else {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              notificationService.showNotification('error', 'Session expired. Please log in again.');
              router.navigateByUrl('/signin');
              return throwError(() => error);
            }
          }),
          catchError(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            notificationService.showNotification('error', 'Session expired. Please log in again.');
            router.navigateByUrl('/signin');
            return throwError(() => error);
          })
        );
      }

      if (message) {
        notificationService.showNotification('error', message);
      }
      return throwError(() => error);
    })
  );
};
