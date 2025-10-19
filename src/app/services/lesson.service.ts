import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { HttpResponse } from '@angular/common/http';

export interface Lesson {
    id?: number;
    className: string;
    teacher: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

@Injectable({
    providedIn: 'root'
})
export class LessonService {
    private apiUrl = 'http://localhost:8081/lessons';

    constructor(private http: HttpClient, public auth: AuthService) {
    }

    getAllByUser(): Observable<Lesson[]> {
        console.log('🟡 Lekérem az összes órát a felhasználóhoz');
        return this.http.get<Lesson[]>(`${this.apiUrl}/allUserLessons`);
    }

    createLesson(lesson: any): Observable<HttpResponse<string>> {
        return this.http.post(`${this.apiUrl}/create`, lesson, {
            observe: 'response',
            responseType: 'text'
    });
    }


    updateLesson(id: number, lesson: Omit<Lesson, 'id'>): Observable<Lesson> {
        return this.http.put<Lesson>(`${this.apiUrl}/update/${id}`, lesson);
    }

    deleteLesson(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' });
    }

    patchLesson(id: number, updates: Partial<Lesson>) {
        return this.http.patch(`${this.apiUrl}/patch/${id}`, updates, {responseType: 'text'});    
    }


    getLessonById(id: number): Observable<Lesson> {
        return this.http.get<Lesson>(`${this.apiUrl}/get/${id}`);
    }

}