import { 
  Component, 
  OnInit, 
  ElementRef, 
  Renderer2, 
  ViewChild 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedHeaderComponent } from '../logged-header/logged-header.component';
import { TodoSectionComponent } from '../todo-section/todo-section.component';
import { ScheduleSectionComponent } from '../schedule-section/schedule-section.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddTodoDialogComponent } from '../todo-section/add-todo-dialog/add-todo-dialog.component';
import { MatButton } from "@angular/material/button";
import { TodoListDialogComponent } from '../todo-list-dialog/todo-list-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LoggedHeaderComponent,
    TodoSectionComponent,
    ScheduleSectionComponent,
    MatDialogModule,
    MatButton
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(ScheduleSectionComponent) scheduleSection!: ScheduleSectionComponent;
  @ViewChild(TodoSectionComponent) todoSection!: TodoSectionComponent;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.adjustLayout();
  }

  private adjustLayout(): void {
    const header = document.querySelector('.logged-header');
    const container = this.el.nativeElement.querySelector('.home-container');
    if (header && container) {
      const headerHeight = header.clientHeight;
      this.renderer.setStyle(container, 'padding-top', `${headerHeight + 32}px`);
    }
  }

  // 🔹 Órarend gombok
  onAddLesson(): void {
    this.scheduleSection.onAddLesson();
  }

  onManageLessons(): void {
    this.scheduleSection.onManageLessons();
  }

  openEditLessonsDialog(): void {
    this.scheduleSection.openEditLessonsDialog();
  }

  // 🔹 Teendő hozzáadása gomb
  onAddTodo(): void {
    const dialogRef = this.dialog.open(AddTodoDialogComponent, {
      width: '420px',
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('🟢 Új teendő adatai:', result);

        const newTodo = {
          title: result.title,
          description: result.description,
          dueTime: result.dueTime, // ✅ helyes kulcsnév
          isItDone: false
        };

        // 🔹 A TodoSection saját metódusával kezeljük a mentést és frissítést
        this.todoSection.addNewTodo(newTodo);
      }
    });
  }

  onManageToDo(): void {
    const dialogRef = this.dialog.open(TodoListDialogComponent, {
      width: '700px',
      panelClass: 'custom-dialog'
    });

    // 🔸 Ha a teendők listája változott (törlés / státuszváltás stb.)
    dialogRef.componentInstance.onTodoChanged.subscribe(() => {
      console.log('🟢 Teendő változás észlelve → lista frissítése');
      this.todoSection.loadTodos(); // a meglévő todo-section metódus
    });
  }
}
