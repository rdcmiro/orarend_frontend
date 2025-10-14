import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, AuthenticationRequest, AuthenticationResponse } from '../services/auth.service';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


import { LoginHeaderComponent } from '../login-header/login-header.component';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

onLogin() {
  const req: AuthenticationRequest = { email: this.email, password: this.password };

  this.auth.login(req).subscribe({
    next: (res: AuthenticationResponse) => {
    
      this.auth.setToken(res.token);

    
      this.router.navigateByUrl('/home');
    },
    error: () => {
      alert('Hibás email vagy jelszó!');
    }
  });
}

}
