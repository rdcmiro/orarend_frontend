import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router'; // ✅ csak a RouterLink direktívát importáljuk

@Component({
  selector: 'app-login-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, RouterLink, DatePipe], 
  templateUrl: './login-header.component.html',
  styleUrls: ['./login-header.component.scss']
})
export class LoginHeaderComponent implements OnInit {
  now: Date = new Date();

  ngOnInit() {
    setInterval(() => (this.now = new Date()), 1000);
  }
}
