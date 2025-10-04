import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = 'http://localhost:8081/auth/authenticate';

  constructor(private http: HttpClient) {}

  login(body: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(this.url, body);
  }
}
