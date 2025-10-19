import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { TodoService, Todo } from '../services/todo.service';

@Component({
  selector: 'app-todo-section',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './todo-section.component.html',
  styleUrls: ['./todo-section.component.scss']
})
export class TodoSectionComponent implements OnInit {
  todos: Todo[] = [];
  todoColumns: string[] = ['title', 'description', 'localTime', 'isItDone'];

  constructor(
    private todoService: TodoService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getAllByUser().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.todos = data;
          this.cdr.detectChanges();
          console.log('✅ Teendők betöltve:', this.todos);
        });
      },
      error: (err) => {
        console.error('🔴 Hiba a teendők lekérésekor:', err);
      }
    });
  }

  addTodo(): void {
    const title = prompt('Add meg a teendő címét:');
    if (!title) return;

    const description = prompt('Rövid leírás:') || '';
    const newTodo: Partial<Todo> = {
      title,
      description,
      localTime: new Date().toISOString(),
      isItDone: false
    };

    this.todoService.createTodo(newTodo).subscribe({
      next: () => this.loadTodos(),
      error: (err) => console.error('🔴 Hiba létrehozáskor:', err)
    });
  }

  toggleTodo(todo: Todo): void {
    this.todoService.patchTodo(todo.id!, { isItDone: todo.isItDone }).subscribe({
      next: () => console.log('✅ Teendő frissítve:', todo.title),
      error: (err) => console.error('🔴 Hiba frissítéskor:', err)
    });
  }
}
