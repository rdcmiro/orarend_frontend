import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  loading = false;
  message = '';

  form = this.fb.group({
    token: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { token, newPassword, confirmPassword } = this.form.value;
    if (newPassword !== confirmPassword) {
      this.message = 'A két jelszó nem egyezik.';
      return;
    }

    this.loading = true;
    this.auth.resetPassword(this.email, token!, newPassword!)
      .subscribe({
        next: (res) => {
          this.message = res;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: () => {
          this.message = 'Hibás kód vagy hiba történt. Próbáld újra.';
          this.loading = false;
        }
      });
  }
}
