import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { throwError } from 'rxjs';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  console.log('✅✅✅✅✅TokenInterceptor fut, token:✅✅✅✅✅✅✅✅✅✅', token);

  if (token && auth.isTokenExpired()) {
    auth.logout();
    return throwError(() => new Error('Token expired'));
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
