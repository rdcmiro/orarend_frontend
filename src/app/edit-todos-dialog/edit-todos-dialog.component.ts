import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TodoService, Todo } from '../services/todo.service';
import { AddTodoDialogComponent } from '../todo-section/add-todo-dialog/add-todo-dialog.component';

@Component({
  selector: 'app-edit-todos-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './edit-todos-dialog.component.html',
  styleUrls: ['./edit-todos-dialog.component.scss']
})
export class EditTodosDialogComponent implements OnInit {
  todos: Todo[] = [];
  loading = false;
  @Output() onTodoEdited = new EventEmitter<void>();

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  // 🔄 Teendők betöltése
  loadTodos(): void {
    this.loading = true;
    this.todoService.getAllByUser().subscribe({
      next: (data: Todo[]) => {
        this.todos = data;
        this.loading = false;
      },
      error: err => {
        console.error('❌ Hiba a lekérésnél:', err);
        this.loading = false;
      }
    });
  }

  // ✏️ Szerkesztés dialógusban
  onEdit(todo: Todo): void {
    const dialogRef = this.dialog.open(AddTodoDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog'
    });

    // 🔹 Edit mód aktiválása és mezők előtöltése
    dialogRef.componentInstance.isEditMode = true;
    dialogRef.componentInstance.title = todo.title;
    dialogRef.componentInstance.description = todo.description;

    const date = new Date(todo.dueTime);
    if (!isNaN(date.getTime())) {
      dialogRef.componentInstance.dueDate = date;
      dialogRef.componentInstance.dueTime = date
        .toTimeString()
        .slice(0, 5); // HH:mm
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const patchData = {
          title: result.title,
          description: result.description,
          dueTime: result.dueTime
        };

        this.todoService.patchTodo(todo.id!, patchData).subscribe({
          next: () => {
            console.log('🟢 Teendő frissítve – újratöltjük');
            this.loadTodos();
            this.onTodoEdited.emit();
          },
          error: err => console.error('❌ Hiba mentésnél:', err)
        });
      }
    });
  }
}
