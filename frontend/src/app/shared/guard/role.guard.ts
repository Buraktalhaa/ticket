import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../pages/auth/services/auth.service';

export const roleGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const cookieService = inject(CookieService)

  const isUserLoggedIn = authService.isThereUser();

  if (!isUserLoggedIn) {
    router.navigateByUrl('/sign-in');
    return false;
  }

  const expectedRoles: string[] = route.data['roles'];
  const role = cookieService.get("role") || '';


  if (expectedRoles && !expectedRoles.includes(role)) {
    router.navigateByUrl('/unauthorized');    
    return false;
  }

  return true;
};