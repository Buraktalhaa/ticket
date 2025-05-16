import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/shared/services/auth.service';

export const canActiveteGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isUserLoggedIn = authService.isThereUser();

  if (!isUserLoggedIn) {
    router.navigateByUrl('/signin');
    return false;
  }

  return true;
};
