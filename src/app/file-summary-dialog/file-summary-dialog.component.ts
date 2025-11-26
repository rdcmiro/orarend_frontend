import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FileService } from '../services/file.service';
import { EmailService } from '../services/email.service';

export interface FileSummaryDialogData {
  id: number;        // fájl ID
  filename: string;  // csak megjelenítéshez
}

@Component({
  selector: 'app-file-summary-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './file-summary-dialog.component.html',
  styleUrls: ['./file-summary-dialog.component.scss']
})
export class FileSummaryDialogComponent implements OnInit {

  loadingSummary = true;
  summary: string | null = null;

  sending = false;
  sendSuccess = false;
  sendError: string | null = null;

  subject: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FileSummaryDialogData,
    private dialogRef: MatDialogRef<FileSummaryDialogComponent>,
    private fileService: FileService,
    private emailService: EmailService
  ) {
    // tárgy automatikus: Jegyzetösszefoglalás – YYYY.MM.DD
    const today = new Date();
    const formatted =
      today.getFullYear() +
      '.' +
      String(today.getMonth() + 1).padStart(2, '0') +
      '.' +
      String(today.getDate()).padStart(2, '0');

    this.subject = `Jegyzetösszefoglalás – ${formatted}`;
  }

  ngOnInit(): void {
    // 🔹 összefoglaló lekérése a backendről
    this.fileService.getSummary(this.data.id).subscribe({
      next: (text: string) => {
        this.summary = text;
        this.loadingSummary = false;
      },
      error: (err) => {
        console.error('Hiba az összefoglalás lekérésekor:', err);
        this.summary = 'Hiba történt az összefoglalás lekérésekor.';
        this.loadingSummary = false;
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSend(): void {
    if (!this.summary) {
      return;
    }

    this.sending = true;
    this.sendError = null;
    this.sendSuccess = false;

    this.emailService.sendEmail(this.subject, this.summary).subscribe({
      next: () => {
        this.sending = false;
        this.sendSuccess = true;
      },
      error: (err) => {
        console.error('Email küldés hiba:', err);
        this.sending = false;
        this.sendError = 'Hiba történt az email küldése közben.';
      }
    });
  }
}
