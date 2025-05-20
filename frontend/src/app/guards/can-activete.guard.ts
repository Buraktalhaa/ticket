import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/shared/services/auth.service';

export const canActiveteGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isUserLoggedIn = authService.isThereUser();

  if (!isUserLoggedIn) {
    router.navigateByUrl('/signin');
    return false;
  }

  const expectedRoles: string[] = route.data['roles'];
  const role = localStorage.getItem("role") || '';


  if (expectedRoles && !expectedRoles.includes(role)) {
    router.navigateByUrl('/main');    
    return false;
  }

  return true;
};
