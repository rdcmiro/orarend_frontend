import {
  Component,
  OnInit,
  NgZone,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { TodoService, Todo } from '../services/todo.service';

@Component({
  selector: 'app-todo-section',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './todo-section.component.html',
  styleUrls: ['./todo-section.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            stagger(70, [
              animate(
                '0.25s ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              )
            ])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class TodoSectionComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  todoColumns: string[] = ['title', 'description', 'remainingTime', 'isItDone'];
  private intervalId: any;

  constructor(
    private todoService: TodoService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTodos();

    // ⏱ Frissítés percenként
    this.intervalId = setInterval(() => {
      this.cdr.detectChanges();
    }, 60 * 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  loadTodos(): void {
    this.todoService.getAllByUser().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.todos = data;
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error('🔴 Hiba a teendők lekérésekor:', err)
    });
  }

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

  addTodo(): void {
    const title = prompt('Add meg a teendő címét:');
    if (!title) return;

    const description = prompt('Rövid leírás:') || '';
    const dueHours = prompt('Hány óra múlva legyen a határidő?');
    const dueTime = new Date();
    if (dueHours) dueTime.setHours(dueTime.getHours() + parseInt(dueHours, 10));

    const newTodo: Partial<Todo> = {
      title,
      description,
      dueTime: dueTime.toISOString(),
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

  // 🔹 Publikus metódus, amit a HomeComponent hívhat új teendő hozzáadására
  addNewTodo(todo: Partial<Todo>): void {
    this.todoService.createTodo(todo).subscribe({
      next: () => {
        console.log('✅ Teendő sikeresen létrehozva a TodoSectionből!');
        this.loadTodos();
      },
      error: (err) => {
        console.error('🔴 Hiba a teendő létrehozásakor:', err);
      }
    });
  }
}
