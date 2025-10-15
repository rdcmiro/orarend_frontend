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
  @ViewChild(MatTable) table?: MatTable<Lesson>;

  lessons: Lesson[] = [];
  todos: Todo[] = [
    { text: 'Matematika házi keddre', done: false },
    { text: 'Irodalom beadandó csütörtökig', done: true },
    { text: 'Történelem dolgozat pénteken', done: false }
  ];

  displayedColumns: string[] = ['dayOfWeek', 'className', 'teacher', 'time'];
  todoColumns: string[] = ['status', 'text'];

  // 🟦 vizuális órarendhez
  weekDays = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];
  timeSlots: string[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private lessonService: LessonService,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    this.adjustLayout();

    // 🟦 félórás idősávok generálása 08:00–20:00 között
    this.generateTimeSlots('08:00', '20:00', 30);

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
  // 🕒 Időkezelő segédfüggvények
  // ─────────────────────────────
  private toMinutes(t: string): number {
    const m = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return NaN;
    const h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    return h * 60 + min;
  }

  private toHHmm(t: string): string {
    const mins = this.toMinutes(t);
    if (Number.isNaN(mins)) return t;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  // ─────────────────────────────
  // 🟦 Idősáv generálás (félórás lépések)
  // ─────────────────────────────
  generateTimeSlots(start: string, end: string, stepMinutes: number) {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;

    for (let t = startTotal; t <= endTotal; t += stepMinutes) {
      const h = Math.floor(t / 60);
      const m = t % 60;
      this.timeSlots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
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

        // normalizáljuk az időformátumokat (HH:mm)
        this.lessons = data.map((lesson) => ({
          ...lesson,
          dayOfWeek: this.mapDayToHungarian(lesson.dayOfWeek),
          startTime: this.toHHmm(lesson.startTime),
          endTime: this.toHHmm(lesson.endTime)
        }));

        console.log('✅ Lessons feltöltve:', this.lessons);

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

  // ─────────────────────────────
  // 🟦 Segédfüggvények a vizuális rácshoz
  // ─────────────────────────────
  getColumn(day: string): number {
    return this.weekDays.indexOf(day) + 2; // +1 az időoszlop, +1 mert 1-indexelt
  }

  getRow(time: string): number {
    const t = this.toHHmm(time);
    return this.timeSlots.indexOf(t) + 2;
  }

  getRowSpan(lesson: Lesson): number {
    const start = this.toMinutes(lesson.startTime);
    const end = this.toMinutes(lesson.endTime);
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 1;
    return Math.max(1, Math.ceil((end - start) / 30)); // 30 perces blokkok
  }
}
