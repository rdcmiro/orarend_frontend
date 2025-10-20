import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-lesson-dialog',
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
  templateUrl: './add-lesson-dialog.component.html',
  styleUrls: ['./add-lesson-dialog.component.scss']
})
export class AddLessonDialogComponent {
  @Output() onLessonEdited = new EventEmitter<void>();


  isEditMode = false;

  className = '';
  teacher = '';
  dayOfWeek = '';
  startTime = '';
  endTime = '';

  weekDays = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];

  // ✅ Egyszerű stringes korlátok, nincs Luxon / Date típushiba
  minTime = '08:00';
  maxTime = '20:00';

  constructor(private dialogRef: MatDialogRef<AddLessonDialogComponent>) {}

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
