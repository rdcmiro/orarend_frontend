import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    // 🔹 Ha van token, de lejárt → logout
    if (token && this.auth.isTokenExpired()) {
      this.auth.logout();
      return throwError(() => new Error('Token expired'));
    }

    // 🔹 Ha van érvényes token → hozzáadjuk a headerhez
    if (token) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(cloned);
    }

    // 🔹 Ha nincs token → simán továbbmegy
    return next.handle(req);
  }
}
