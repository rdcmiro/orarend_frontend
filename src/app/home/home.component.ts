import { Component, OnInit, ElementRef, Renderer2, ViewChild, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoggedHeaderComponent } from '../logged-header/logged-header.component';
import { LessonService, Lesson } from '../services/lesson.service';
import { MatDialog } from '@angular/material/dialog';
import { AddLessonDialogComponent } from '../add-lesson-dialog/add-lesson-dialog.component';
import { LessonListDialogComponent } from '../lesson-list-dialog/lesson-list-dialog.component';
import { UtilityService } from '../services/utility.service';

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

  weekDays = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];
  timeSlots: string[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private lessonService: LessonService,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private utils: UtilityService
  ) {}

  ngOnInit(): void {
    this.adjustLayout();
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
  // 🟦 Idősáv generálás
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

        this.ngZone.run(() => {
          // 🔹 új referencia, hogy Angular érzékelje
        this.lessons = [...data.map((lesson) => ({
          ...lesson,
          dayOfWeek: this.utils.mapDayToHungarian(lesson.dayOfWeek),
          startTime: this.utils.formatTime(lesson.startTime),
          endTime: this.utils.formatTime(lesson.endTime)
        }))];
          // 🔹 három szintű újrarajzolás: CD → Table → AppRef
          this.cdr.detectChanges();
          this.cdr.markForCheck();
          this.table?.renderRows();
          this.appRef.tick();

          console.log('✅ Lessons újratöltve és kirajzolva.');
        });
      },
      error: (err) => {
        console.error('🔴 Hiba az órák lekérésekor:', err);
      }
    });
  }

  onAddLesson(): void {
    const dialogRef = this.dialog.open(AddLessonDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newLesson = {
          className: result.className,
          teacher: result.teacher,
          dayOfWeek: this.utils.mapDayToEnglish(result.dayOfWeek),
          startTime: result.startTime,
          endTime: result.endTime
        };
        this.lessonService.createLesson(newLesson).subscribe({
          next: (response) => {
            console.log('🟢 Válasz érkezett a backendtől:', response);            
            console.log('🚀 Létrehozás sikeres, újratöltés...');
            this.loadLessons();
          },
          error: (err) => {
            if (err.status === 409) {
              alert('⚠️ Ilyen óra már létezik!');
            } else {
              console.error('🔴 Hiba létrehozás közben:', err);
            }
          }
        });
      }
    });
  }

  onManageLessons(): void {
    const dialogRef = this.dialog.open(LessonListDialogComponent, {
      width: '700px',
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadLessons();
    });
  }

  getColumn(day: string): number {
    return this.weekDays.indexOf(day) + 1;
  }

  getRow(time: string): number {
    const t = this.toHHmm(time);
    return this.timeSlots.indexOf(t) + 2;
  }

  getRowSpan(lesson: Lesson): number {
    const start = this.toMinutes(lesson.startTime);
    const end = this.toMinutes(lesson.endTime);
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 1;
    return Math.max(1, Math.ceil((end - start) / 30));
  }
}
