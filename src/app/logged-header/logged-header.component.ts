import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-logged-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterLink],
  templateUrl: './logged-header.component.html',
  styleUrls: ['./logged-header.component.scss']
})
export class LoggedHeaderComponent {
  constructor(private router: Router) {}

  logout() {
    // később ide jön az AuthService.logout()
    this.router.navigate(['/login']);
  }
}
