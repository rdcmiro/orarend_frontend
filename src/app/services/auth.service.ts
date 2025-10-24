import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface JwtPayload { 
  exp: number;
  sub?: string;
  [k: string]: any }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8081/auth';
  private ACCESS_KEY = 'token';

    setToken(token: string) {
    localStorage.setItem(this.ACCESS_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  clearToken() {
    localStorage.removeItem(this.ACCESS_KEY);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      return !exp || exp <= now;
    } catch {
      return true;
    }
  }

  constructor(private http: HttpClient, private router: Router) {}

  login(body: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, body);
  }


  register(body: RegisterRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/register`, body);
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/forgotPassword`, { email }, { responseType: 'text' });
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/resetPassword`, { email, token, newPassword }, { responseType: 'text' });
  }
  
  logout() {
    this.clearToken();
    this.router.navigate(['/login']);
  }

}

