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
          clearSession()
          return throwError(() => error);
        }

        return apiService.post('http://localhost:3000/auth/refresh', { refreshToken }).pipe(
          switchMap((res: any) => {
            const accessToken:string = res.body?.accessToken;
            if (accessToken) {
              cookieService.set('accessToken', accessToken);
              notificationService.showNotification('success', 'Session renewed successfully.');

              // Orijinal isteği yeni token ile tekrar et
              const clonedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
              });
              return next(clonedReq);
            } else {
              clearSession()
              return throwError(() => error);
            }
          }),
          catchError(() => {
            clearSession()
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
  function clearSession() {
    cookieService.delete('accessToken', '/');
    cookieService.delete('refreshToken', '/');
    notificationService.showNotification('error', 'Session expired. Please log in again.');
    router.navigateByUrl('/sign-in');
  }
};