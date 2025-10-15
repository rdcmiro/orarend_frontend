import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-lesson-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './add-lesson-dialog.component.html',
  styleUrls: ['./add-lesson-dialog.component.scss']
})
export class AddLessonDialogComponent {
  className = '';
  teacher = '';
  dayOfWeek = '';
  startTime = '';
  endTime = '';

  weekDays = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];

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
