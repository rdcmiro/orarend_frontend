import { Component, OnInit, NgZone } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LessonService, Lesson } from '../services/lesson.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-lesson-list-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatListModule],
  templateUrl: './lesson-list-dialog.component.html',
  styleUrls: ['./lesson-list-dialog.component.scss']
})
export class LessonListDialogComponent implements OnInit {
  lessons: Lesson[] = [];
  loading = true;

  constructor(
    private lessonService: LessonService,
    private dialogRef: MatDialogRef<LessonListDialogComponent>,
    private ngZone: NgZone,
    private utils: UtilityService
  ) {}

  ngOnInit(): void {
    console.log('🟡 LessonListDialogComponent inicializálva');
    this.loadLessons();
  }

  loadLessons(): void {
    this.lessonService.getAllByUser().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          // 🔹 Magyar napnevek + rövid időformátum
          this.lessons = data.map(lesson => ({
            ...lesson,
            dayOfWeek: this.utils.mapDayToHungarian(lesson.dayOfWeek),
            startTime: this.utils.formatTime(lesson.startTime),
            endTime: this.utils.formatTime(lesson.endTime)
          }));
          this.loading = false;
        });
      },
      error: (err) => {
        this.ngZone.run(() => (this.loading = false));
        console.error('🔴 Hiba a lekérés közben:', err);
      }
    });
  }

  deleteLesson(id: number): void {
    if (!confirm('Biztosan törlöd ezt az órát?')) return;

    this.lessonService.deleteLesson(id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.lessons = this.lessons.filter(l => l.id !== id);
        });
      },
      error: (err) => alert('❌ Hiba történt: ' + err.message)
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
