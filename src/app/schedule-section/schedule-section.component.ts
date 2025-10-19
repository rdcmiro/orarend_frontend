import { Component, OnInit, NgZone, ChangeDetectorRef, ApplicationRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { LessonService, Lesson } from '../services/lesson.service';
import { MatDialog } from '@angular/material/dialog';
import { AddLessonDialogComponent } from '../add-lesson-dialog/add-lesson-dialog.component';
import { LessonListDialogComponent } from '../lesson-list-dialog/lesson-list-dialog.component';
import { EditLessonsDialogComponent } from '../edit-lessons-dialog/edit-lessons-dialog.component';
import { UtilityService } from '../services/utility.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-schedule-section',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './schedule-section.component.html',
  styleUrls: ['./schedule-section.component.scss'],
  animations: [
    trigger('shrinkOut', [
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({
            transform: 'scale(0)',
            opacity: 0
          })
        )
      ])
    ])
  ]
})
export class ScheduleSectionComponent implements OnInit {
  @ViewChild(MatTable) table?: MatTable<Lesson>;

  lessons: Lesson[] = [];
  weekDays = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];
  timeSlots: string[] = [];

  constructor(
    private lessonService: LessonService,
    private dialog: MatDialog,
    private utils: UtilityService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    this.generateTimeSlots('08:00', '20:00', 30);
    this.loadLessons();
  }

  // 🟦 Idősáv generálás
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

  // 🟩 Lekérések
  loadLessons(): void {
    console.log('🟡 Órák lekérése...');

    this.lessonService.getAllByUser().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.lessons = [
            ...data.map((lesson) => ({
              ...lesson,
              dayOfWeek: this.utils.mapDayToHungarian(lesson.dayOfWeek),
              startTime: this.utils.formatTime(lesson.startTime),
              endTime: this.utils.formatTime(lesson.endTime)
            }))
          ];

          this.cdr.detectChanges();
          this.table?.renderRows();
          this.appRef.tick();

          console.log('✅ Lessons újratöltve.');
        });
      },
      error: (err) => console.error('🔴 Hiba az órák lekérésekor:', err)
    });
  }

  // 🟢 CRUD műveletek
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
          next: () => this.loadLessons(),
          error: (err) => {
            if (err.status === 409) alert('⚠️ Ilyen óra már létezik!');
            else console.error('🔴 Hiba létrehozáskor:', err);
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

    dialogRef.componentInstance.onLessonDeleted.subscribe(() => {
      this.loadLessons();
    });
  }

  openEditLessonsDialog(): void {
    const dialogRef = this.dialog.open(EditLessonsDialogComponent, {
      width: '700px',
      panelClass: 'custom-dialog'
    });

    dialogRef.componentInstance.onLessonEdited.subscribe(() => {
      this.loadLessons();
    });
  }

  // 📅 Rács segédfüggvények
  getColumn(day: string): number {
    return this.weekDays.indexOf(day) + 1;
  }

  getRow(time: string): number {
    const index = this.timeSlots.indexOf(time);
    return index + 2;
  }

  getRowSpan(lesson: Lesson): number {
    const toMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const start = toMinutes(lesson.startTime);
    const end = toMinutes(lesson.endTime);
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 1;
    return Math.max(1, Math.ceil((end - start) / 30));
  }
}
