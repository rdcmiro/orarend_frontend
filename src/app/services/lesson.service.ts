import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

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
        return this.http.get<Lesson[]>(`${this.apiUrl}/allUserLessons`);
    }

    createLesson(lesson: Omit<Lesson, 'id'>): Observable<Lesson> {
        return this.http.post<Lesson>(`${this.apiUrl}/create`, lesson);
    }

      
    updateLesson(id: number, lesson: Omit<Lesson, 'id'>): Observable<Lesson> {
        return this.http.put<Lesson>(`${this.apiUrl}/update/${id}`, lesson);
    }

    deleteLesson(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    }

    getLessonById(id: number): Observable<Lesson> {
        return this.http.get<Lesson>(`${this.apiUrl}/get/${id}`);
    }


}