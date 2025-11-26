import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudyPlanService } from '../services/study-plan.service';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-study-plan-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './study-plan-dialog.component.html',
  styleUrls: ['./study-plan-dialog.component.scss']
})
export class StudyPlanDialogComponent implements OnInit {

  loading = false;
  planText = '';
  sending = false;
  sendSuccess = false;
  sendError: string | null = null;
  subject: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<StudyPlanDialogComponent>,
    private studyPlanService: StudyPlanService,
    private emailService: EmailService
  ) {
    const today = new Date();
    const formatted =
      today.getFullYear() +
      '.' +
      String(today.getMonth() + 1).padStart(2, '0') +
      '.' +
      String(today.getDate()).padStart(2, '0');

    this.subject = `Tanulási terv – ${formatted}`;
  }

  ngOnInit(): void {
    this.loadStudyPlan();
  }

  /** 🧠 Tanulási terv lekérése az /assist/todo AI végpontról */
  loadStudyPlan(): void {
    this.loading = true;

    this.studyPlanService.getStudyPlan().subscribe({
      next: (res: string) => {
        this.planText = res;
        this.loading = false;
      },
      error: err => {
        console.error('Tanulási terv AI hiba:', err);
        this.planText = 'Hiba történt a tanulási terv lekérése közben.';
        this.loading = false;
      }
    });
  }


  onSend(): void {
    if (!this.planText) {
      return;
    }

    this.sending = true;
    this.sendError = null;
    this.sendSuccess = false;


    this.emailService.sendEmail(this.subject, this.planText).subscribe({
      next: () => {
        this.sending = false;
        this.sendSuccess = true;
      },
      error: err => {
        console.error('Email küldés hiba (tanulási terv):', err);
        this.sending = false;
        this.sendError = 'Hiba történt az email küldése közben.';
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
