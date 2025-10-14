import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoggedHeaderComponent } from '../logged-header/logged-header.component';

export interface Lesson {
  day: string;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
}






export interface Todo {
  text: string;
  done: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    LoggedHeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  lessons: Lesson[] = [
    { day: 'Hétfő', subject: 'Matematika', teacher: 'Kovács Béla', startTime: '08:00', endTime: '08:45' },
    { day: 'Kedd', subject: 'Irodalom', teacher: 'Nagy Éva', startTime: '10:00', endTime: '10:45' },
    { day: 'Szerda', subject: 'Történelem', teacher: 'Szabó Lajos', startTime: '11:00', endTime: '11:45' }
  ];

  displayedColumns: string[] = ['day', 'subject', 'teacher', 'time'];
  todoColumns: string[] = ['status', 'text'];

  todos: Todo[] = [
    { text: 'Matematika házi keddre', done: false },
    { text: 'Irodalom beadandó csütörtökig', done: true },
    { text: 'Történelem dolgozat pénteken', done: false }
  ];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Megkeressük a header elemét
    const header = document.querySelector('.logged-header');
    const container = this.el.nativeElement.querySelector('.home-container');

    if (header && container) {
      const headerHeight = header.clientHeight;
      this.renderer.setStyle(container, 'padding-top', `${headerHeight + 32}px`);
      // +32 px extra tér a légies elrendezéshez
    }
  }

  onAddLesson() {
    alert('🟢 Később ide jön az "Új óra hozzáadása" funkció.');
  }
}
