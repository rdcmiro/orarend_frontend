import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RegisterComponent } from './register/register.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'file', component: FileManagerComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '' }
];
