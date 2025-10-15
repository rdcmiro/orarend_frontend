import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoggedHeaderComponent } from '../logged-header/logged-header.component';
import { LessonService, Lesson } from '../services/lesson.service';
import { ChangeDetectorRef, ApplicationRef } from '@angular/core';






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
export class HomeComponent implements OnInit {
  @ViewChild(MatTable) table?: MatTable<Lesson>; // 🔹 táblázat referenciája

  lessons: Lesson[] = [];
  todos: Todo[] = [
    { text: 'Matematika házi keddre', done: false },
    { text: 'Irodalom beadandó csütörtökig', done: true },
    { text: 'Történelem dolgozat pénteken', done: false }
  ];

  displayedColumns: string[] = ['dayOfWeek', 'className', 'teacher', 'time'];
  todoColumns: string[] = ['status', 'text'];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private lessonService: LessonService,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    this.adjustLayout();

    // Kis delay, hogy az interceptor és az auth service biztosan készen legyen
    setTimeout(() => {
      const token = this.lessonService.auth.getToken();

      if (token && !this.lessonService.auth.isTokenExpired()) {
        console.log('🔁 Token érvényes, órák betöltése indul...');
        this.loadLessons();
      } else {
        console.warn('⚠️ Token hiányzik vagy lejárt — kiléptetés');
        this.lessonService.auth.logout();
      }
    }, 100);
  }

  ngAfterViewInit() {
    // 👇 Chrome-nál néha kell egy extra tick az első megjelenés után
    setTimeout(() => this.appRef.tick(), 0);
  }

  private adjustLayout(): void {
    const header = document.querySelector('.logged-header');
    const container = this.el.nativeElement.querySelector('.home-container');
    if (header && container) {
      const headerHeight = header.clientHeight;
      this.renderer.setStyle(container, 'padding-top', `${headerHeight + 32}px`);
    }
  }

  // ─────────────────────────────
  // CRUD funkciók
  // ─────────────────────────────
  loadLessons(): void {
    console.log('🟡 Lekérés indult...');
    this.lessonService.getAllByUser().subscribe({
      next: (data) => {
        console.log('🟢 Backend válasz:', data);

        this.lessons = data.map((lesson) => ({
          ...lesson,
          dayOfWeek: this.mapDayToHungarian(lesson.dayOfWeek)
        }));

        console.log('✅ Lessons feltöltve:', this.lessons);

        // 🔧 Chrome: néha nem renderel újra → manuális frissítés
        setTimeout(() => {
          this.table?.renderRows();
          this.cdr.detectChanges();
          this.appRef.tick();
        }, 0);
      },
      error: (err) => {
        console.error('🔴 Hiba az órák lekérésekor:', err);
      }
    });
  }

  onAddLesson(): void {
    const newLesson = {
      className: 'Fizika',
      teacher: 'Varga Tamás',
      dayOfWeek: 'Thursday',
      startTime: '09:00',
      endTime: '09:45'
    };

    this.lessonService.createLesson(newLesson).subscribe({
      next: () => this.loadLessons()
    });
  }

  onDeleteLesson(id: number): void {
    this.lessonService.deleteLesson(id).subscribe({
      next: () => this.loadLessons()
    });
  }

  mapDayToHungarian(day: string): string {
    const map: Record<string, string> = {
      Monday: 'Hétfő',
      Tuesday: 'Kedd',
      Wednesday: 'Szerda',
      Thursday: 'Csütörtök',
      Friday: 'Péntek'
    };
    return map[day] || day;
  }
}
