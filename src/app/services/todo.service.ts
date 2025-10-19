import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { HttpResponse } from '@angular/common/http';

export interface Todo {
    id?: number;
    title: string;
    description: string;
    dueTime: string;
    isItDone: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    private apiUrl = 'http://localhost:8081/toDo';

    constructor(private http: HttpClient, public auth: AuthService) {
    }

    getAllByUser(): Observable<Todo[]> {
        console.log('🟡 Lekérem az összes teendőt a felhasználóhoz');
        return this.http.get<Todo[]>(`${this.apiUrl}/allUserToDos`);
    }

    createTodo(todo: any): Observable<HttpResponse<string>> {
        return this.http.post(`${this.apiUrl}/create`, todo, {
            observe: 'response',
            responseType: 'text'
    });
    }

    updateTodo(id: number, todo: Omit<Todo, 'id'>): Observable<Todo> {
        return this.http.put<Todo>(`${this.apiUrl}/update/${id}`, todo);
    }

    deleteTodo(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' });
    }

    patchTodo(id: number, updates: Partial<Todo>) {
        return this.http.patch(`${this.apiUrl}/patch/${id}`, updates, {responseType: 'text'});    
    }

    getTodoById(id: number): Observable<Todo> {
        return this.http.get<Todo>(`${this.apiUrl}/get/${id}`);
    }

}