import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { LessonService, Lesson } from '../services/lesson.service';
import { UtilityService } from '../services/utility.service';
import { EditLessonDialogComponent } from '../edit-lesson-dialog/edit-lesson-dialog.component';

@Component({
  selector: 'app-edit-lessons-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './edit-lessons-dialog.component.html',
  styleUrls: ['./edit-lessons-dialog.component.scss']
})
export class EditLessonsDialogComponent implements OnInit {
  lessons: Lesson[] = [];
  loading: boolean = false; // 🔹 hozzáadva a HTML-hez
  @Output() onLessonEdited = new EventEmitter<void>(); // 🔹 HomeComponent figyeli majd

  constructor(
    private lessonService: LessonService,
    private utils: UtilityService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadLessons();
  }

  // ─────────────────────────────
  // 🔄 Órák betöltése
  // ─────────────────────────────
  loadLessons(): void {
    this.loading = true; // 🔹 betöltés indul
    this.lessonService.getAllByUser().subscribe({
      next: (data: Lesson[]) => {
        this.lessons = data.map((lesson) => ({
          ...lesson,
          dayOfWeek: this.utils.mapDayToHungarian(lesson.dayOfWeek),
          startTime: this.utils.formatTime(lesson.startTime),
          endTime: this.utils.formatTime(lesson.endTime)
        }));
        this.loading = false; // 🔹 sikeres betöltés
      },
      error: (err: any) => {
        console.error('❌ Hiba a lekérésnél:', err);
        this.loading = false; // 🔹 hiba után is állítsuk vissza
      }
    });
  }

  // ─────────────────────────────
  // ✏️ Óra szerkesztése dialógusban
  // ─────────────────────────────
  onEdit(lesson: Lesson): void {
    const dialogRef = this.dialog.open(EditLessonDialogComponent, {
      width: '400px',
      data: { ...lesson }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 🔹 magyar → angol napnév konverzió backendnek
        const patchData = {
          ...result,
          dayOfWeek: this.utils.mapDayToEnglish(result.dayOfWeek)
        };

        this.lessonService.patchLesson(lesson.id!, patchData).subscribe({
          next: () => {
            console.log('🟢 Óra frissítve – újratöltjük és jelezzük a Home-nak');
            this.loadLessons();
            this.onLessonEdited.emit(); // 🔹 értesítés a HomeComponentnek
          },
          error: (err: any) => console.error('❌ Hiba a mentésnél:', err)
        });
      }
    });
  }
}
