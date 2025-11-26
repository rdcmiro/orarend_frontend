import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudyPlanService {

  private baseUrl = 'http://localhost:8081/assist';

  constructor(private http: HttpClient) {}

  /**
   * Tanulási terv lekérése a backend AI /assist/todo végpontjáról.
   * A backend egy sima Stringet küld vissza ResponseEntity-ben.
   */
  getStudyPlan(): Observable<string> {
    return this.http.post(`${this.baseUrl}/todo`, null, {
      responseType: 'text'
    });
  }
}
