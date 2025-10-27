import { Component, OnInit, NgZone, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LessonService, Lesson } from '../services/lesson.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { UtilityService } from '../services/utility.service';
import { MatDialogModule } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConfirmDialogComponent } from '../shared/confirm/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-lesson-list-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatListModule, MatDialogModule],
  templateUrl: './lesson-list-dialog.component.html',
  styleUrls: ['./lesson-list-dialog.component.scss'],
  animations: [
    trigger('shrinkOut', [
      transition(':leave', [
        animate(
          '250ms ease-in',
          style({
            transform: 'scale(0.8)',
            opacity: 0
          })
        )
      ])
    ])
  ]
})
export class LessonListDialogComponent implements OnInit {
  lessons: Lesson[] = [];
  loading = true;

  /** 🔹 Ezt figyeli majd a HomeComponent */
  @Output() onLessonDeleted = new EventEmitter<void>();

  constructor(
    private lessonService: LessonService,
    private dialogRef: MatDialogRef<LessonListDialogComponent>,
    private dialog: MatDialog, // ✅ hiányzott
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
          this.lessons = data.map((lesson) => ({
            ...lesson,
            startTime: this.formatTime(lesson.startTime),
            endTime: this.formatTime(lesson.endTime)
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

  private formatTime(time: string): string {
    if (!time) return '';
    return time.slice(0, 5);
  }

  /** 🔹 Törlés megerősítő dialógussal */
  deleteLesson(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog', // ✅ megtartva a dizájn, animáció nélkül
      data: {
        title: 'Óra törlése',
        message: 'Biztosan törlöd ezt az órát?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return; 

      this.lessonService.deleteLesson(id).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.lessons = this.lessons.filter((l) => l.id !== id);
            console.log('🟢 Óra törölve, lista frissítve, emitting');
            this.onLessonDeleted.emit();
          });
        },
        error: (err) => alert('❌ Hiba történt: ' + err.message)
      });
    });
  }

  /** 🔹 Dialógus bezárása */
  close(): void {
    this.dialogRef.close();
  }
}
