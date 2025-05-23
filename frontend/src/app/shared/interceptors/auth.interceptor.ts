import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);
  const apiService = inject(ApiService);
  const cookieService = inject(CookieService);

  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const status = error?.status;
      if (status === 401) {
        const refreshToken = cookieService.get('refreshToken');
        if (!refreshToken) {
          cookieService.delete('accessToken');
          cookieService.delete('refreshToken');
          notificationService.showNotification('error', 'Please log in again.');
          router.navigateByUrl('/sign-in');
          return throwError(() => error);
        }

        return apiService.post('http://localhost:3000/auth/refresh', { refreshToken }).pipe(
          switchMap((res: any) => {
            const accessToken = res.body?.accessToken; // observe: 'response' ise body üzerinden al
            if (accessToken) {
              cookieService.set('accessToken', accessToken);
              notificationService.showNotification('success', 'Session renewed successfully.');

              // Orijinal isteği yeni token ile tekrar et
              const clonedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
              });
              return next(clonedReq);
            } else {
              cookieService.delete('accessToken');
              cookieService.delete('refreshToken');
              notificationService.showNotification('error', 'Session expired. Please log in again.');
              router.navigateByUrl('/sign-in');
              return throwError(() => error);
            }
          }),
          catchError(() => {
            cookieService.delete('accessToken');
            cookieService.delete('refreshToken');
            notificationService.showNotification('error', 'Session expired. Please log in again.');
            router.navigateByUrl('/sign-in');
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};