import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private baseUrl = 'http://localhost:8081/sendOut';

  constructor(private http: HttpClient) {}

  sendEmail(subject: string, body: string): Observable<string> {
    const payload = {
      subject: subject,
      body: body
    };

    return this.http.post(`${this.baseUrl}/sendToUser`, payload, {
      responseType: 'text'
    });
  }
}
