import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginHeaderComponent } from '../login-header/login-header.component';
import { AuthService, RegisterRequest, AuthenticationResponse } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,  
    LoginHeaderComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    const body: RegisterRequest = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.auth.register(body).subscribe({
      next: (res: AuthenticationResponse) => {
        localStorage.setItem('token', res.token);
        alert('Sikeres regisztráció!');
        this.router.navigateByUrl('/home');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          alert('Ez az email vagy felhasználónév már létezik!');
        } else {
          alert('Hiba történt a regisztráció során!');
        }
      }
    });
  }
}
