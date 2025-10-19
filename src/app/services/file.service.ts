import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileService {
  private baseUrl = 'http://localhost:8081/files';

  constructor(private http: HttpClient) {}

    // 🔹 user fájljainak lekérése
  getAllFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAllFilesByUser`);
  }

  uploadFile(file: File, lessonId?: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (lessonId) formData.append('lessonId', lessonId.toString());
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  getSummary(id: number): Observable<string> {
    return this.http.get(`${this.baseUrl}/${id}/summary`, { responseType: 'text' });
  }
}
