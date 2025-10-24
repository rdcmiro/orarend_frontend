// forgot-password.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginHeaderComponent } from '../login-header/login-header.component';  
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    LoginHeaderComponent,
    RouterModule
  ]
})
export class ForgotPasswordComponent {
  loading = false;
  message = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    this.auth.forgotPassword(this.form.value.email!)
      .subscribe({
        next: (res) => {
          this.message = res;
          setTimeout(() => this.router.navigate(['/reset-password'], {
            queryParams: { email: this.form.value.email }
          }), 2000);
        },
        error: () => {
          this.message = 'Hiba történt, próbáld újra.';
          this.loading = false;
        }
      });
  }
}
