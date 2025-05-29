import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../pages/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isUserLoggedIn = authService.isThereUser();

  if (!isUserLoggedIn) {
    router.navigate(['/sign-in'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  return true;
};
