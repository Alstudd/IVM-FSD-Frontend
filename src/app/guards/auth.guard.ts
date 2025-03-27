import { inject } from '@angular/core';
import { 
  CanActivateFn, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const requiredRoles = route.data['roles'] as string[];

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles) {
    const userRoles = authService.getUserRoles();
    const hasRequiredRole = requiredRoles.some(role => 
      userRoles.includes(role)
    );

    if (!hasRequiredRole) {
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};