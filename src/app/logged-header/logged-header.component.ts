import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { StudyPlanDialogComponent } from '../study-plan-dialog/study-plan-dialog.component';

@Component({
  selector: 'app-logged-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatDialogModule, RouterLink],
  templateUrl: './logged-header.component.html',
  styleUrls: ['./logged-header.component.scss']
})
export class LoggedHeaderComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  openStudyPlanDialog(): void {
    this.dialog.open(StudyPlanDialogComponent, {
      width: '720px',
    });
  }
}
