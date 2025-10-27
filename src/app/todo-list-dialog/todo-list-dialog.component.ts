import { Component, OnInit, NgZone, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm/confirm-dialog/confirm-dialog.component';
import { TodoService, Todo } from '../services/todo.service';
import { UtilityService } from '../services/utility.service'; // opcionális, ha kell másra

@Component({
  selector: 'app-todo-list-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatListModule, MatCheckboxModule, MatDialogModule],
  templateUrl: './todo-list-dialog.component.html',
  styleUrls: ['./todo-list-dialog.component.scss'],
  animations: [
    trigger('shrinkOut', [
      transition(':leave', [
        animate(
          '250ms ease-in',
          style({
            transform: 'scale(0.9)',
            opacity: 0
          })
        )
      ])
    ])
  ]
})
export class TodoListDialogComponent implements OnInit {
  todos: Todo[] = [];
  loading = true;

  @Output() onTodoChanged = new EventEmitter<void>();

constructor(
  private todoService: TodoService,
  private dialogRef: MatDialogRef<TodoListDialogComponent>,
  private ngZone: NgZone,
  private utils: UtilityService,
  private dialog: MatDialog // 👈 EZ HIÁNYZOTT
) {}

  ngOnInit(): void {
    console.log('🟡 TodoListDialogComponent inicializálva');
    this.loadTodos();
  }

  /** Teendők betöltése a backendről (rendezve lejárati idő szerint) */
  loadTodos(): void {
    this.todoService.getAllByUser().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.todos = data
            .sort((a, b) => {
              if (!a.dueTime && !b.dueTime) return 0;
              if (!a.dueTime) return 1;
              if (!b.dueTime) return -1;
              return new Date(a.dueTime).getTime() - new Date(b.dueTime).getTime();
            });
          this.loading = false;
          console.log('🟢 Teendők betöltve és rendezve:', this.todos.length);
        });
      },
      error: (err) => {
        this.ngZone.run(() => (this.loading = false));
        console.error('🔴 Hiba a teendők lekérése közben:', err);
      }
    });
  }

  /** HH:mm formázás, ha pl. "12:30:00" jön */
  private formatTime(time: string | null | undefined): string {
    if (!time) return '';
    return time.slice(0, 5);
  }

  /** Készre jelölés váltása (PATCH) */
  toggleDone(todo: Todo): void {
    const updated = !todo.isItDone;
    this.todoService.patchTodo(todo.id!, { isItDone: updated }).subscribe({
      next: () => {
        this.ngZone.run(() => {
          todo.isItDone = updated;
          console.log(
            `🟢 Teendő státusz frissítve (id=${todo.id}) → ${updated ? 'kész' : 'nincs kész'}`
          );
          this.onTodoChanged.emit();
        });
      },
      error: (err) => {
        console.error('🔴 Hiba státusz frissítésnél:', err);
      }
    });
  }

  /** Teendő törlése */
  deleteTodo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    panelClass: 'custom-dialog',
    data: {
      title: 'Teendő törlése',
      message: 'Biztosan törölni szeretnéd ezt a teendőt?'
    }
  });

  dialogRef.afterClosed().subscribe((confirmed) => {
    if (!confirmed) return;

    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.todos = this.todos.filter((t) => t.id !== id);
          console.log('🗑️ Teendő törölve, lista frissítve');
          this.onTodoChanged.emit();
        });
      },
      error: (err) => {
        console.error('🔴 Hiba a törlés közben:', err);
        alert('❌ Hiba történt: ' + (err?.message ?? 'ismeretlen hiba'));
      }
    });
  });
  }

  /** Hátralévő idő kiszámítása */
  getRemainingTime(todo: Todo): string {
    if (!todo.dueTime) return '—';
    const now = new Date();
    const due = new Date(todo.dueTime);
    const diffMs = due.getTime() - now.getTime();

    if (diffMs <= 0) return '⏰ Lejárt';

    const diffMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (hours > 0) return `${hours} óra ${minutes} perc`;
    return `${minutes} perc`;
  }

  /** Színezés a hátralévő idő alapján */
  getRemainingColor(todo: Todo): string {
    if (!todo.dueTime) return 'gray';
    const now = new Date();
    const due = new Date(todo.dueTime);
    const diffMs = due.getTime() - now.getTime();

    if (diffMs <= 0) return 'red'; // lejárt

    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) return '#ef5350'; // 🔴 piros
    if (diffHours < 3) return '#ffb74d'; // 🟧 narancs
    return '#64b5f6'; // 🟦 alap kék
  }

  close(): void {
    this.dialogRef.close();
  }
}
