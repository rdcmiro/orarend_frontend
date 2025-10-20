import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { Lesson } from '../services/lesson.service';

@Component({
  selector: 'app-edit-lesson-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMatTimepickerModule
  ],
  templateUrl: './edit-lesson-dialog.component.html',
  styleUrls: ['./edit-lesson-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditLessonDialogComponent {
  className = '';
  teacher = '';
  dayOfWeek = '';
  startTime = '';
  endTime = '';

  weekDays = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];

  minTime = '08:00';
  maxTime = '20:00';

  constructor(
    private dialogRef: MatDialogRef<EditLessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Lesson
  ) {
    // előtöltjük a meglévő értékeket
    this.className = data.className;
    this.teacher = data.teacher;
    this.dayOfWeek = data.dayOfWeek;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
  }

  onSave() {
    if (!this.className || !this.dayOfWeek || !this.startTime || !this.endTime) return;
    this.dialogRef.close({
      className: this.className,
      teacher: this.teacher,
      dayOfWeek: this.dayOfWeek,
      startTime: this.startTime,
      endTime: this.endTime
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
