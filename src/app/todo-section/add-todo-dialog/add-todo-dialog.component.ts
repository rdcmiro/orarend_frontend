import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter
} from '@angular/material/core';

@Component({
  selector: 'app-add-todo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-todo-dialog.component.html',
  styleUrls: ['./add-todo-dialog.component.scss']
})
export class AddTodoDialogComponent {
  title = '';
  description = '';
  dueDate: Date | null = null;
  dueTime = '';

  constructor(private dialogRef: MatDialogRef<AddTodoDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }

save(): void {
  if (!this.dueDate || !this.dueTime) {
    this.dueDate = new Date();
    this.dueTime = '23:59';
  }

  const [hours, minutes] = this.dueTime.split(':').map(Number);
  const dueDateTime = new Date(this.dueDate);
  dueDateTime.setHours(hours, minutes, 0, 0);

  // 🔹 Helyi ISO string (NEM UTC), NEM fűzünk hozzá semmit
  const year = dueDateTime.getFullYear();
  const month = String(dueDateTime.getMonth() + 1).padStart(2, '0');
  const day = String(dueDateTime.getDate()).padStart(2, '0');
  const hour = String(dueDateTime.getHours()).padStart(2, '0');
  const minute = String(dueDateTime.getMinutes()).padStart(2, '0');
  const second = String(dueDateTime.getSeconds()).padStart(2, '0');

  // 🔹 Ez pontosan a felhasználó helyi ideje, időzóna nélkül
  const localTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

  this.dialogRef.close({
    title: this.title.trim(),
    description: this.description.trim(),
    dueTime: localTimeString // pl. "2025-10-19T19:30:00"
  });
}
}
