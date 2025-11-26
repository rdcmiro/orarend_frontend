import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private baseUrl = 'http://localhost:8081/sendOut';

  constructor(private http: HttpClient) {}

sendEmail(subject: string, body: string): Observable<string> {
  const params = new HttpParams()
    .set('body', body)
    .set('subject', subject);

  return this.http.post(`${this.baseUrl}/sendToUser`, null, {
    params,
    responseType: 'text'
  });
}
}
