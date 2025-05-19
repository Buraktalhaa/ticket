import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);
  const apiService = inject(ApiService);

  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const status = error?.status;
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
      return throwError(() => error);
    })
  )


};
