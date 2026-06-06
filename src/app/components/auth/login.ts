import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-bg min-h-screen flex flex-col items-center justify-center p-4">
      <!-- Animated background particles -->
      <div class="particles">
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span>
      </div>

      <div class="login-card w-full max-w-md relative z-10">
        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <div class="logo-icon mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            Aero<span class="text-blue-400">Cast</span>
          </h1>
          <p class="text-slate-400 text-sm mt-1">Real-time Weather Intelligence</p>
        </div>

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <!-- Username -->
          <div class="input-group">
            <label class="input-label">Username</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input
                type="text"
                formControlName="username"
                id="login-username"
                placeholder="Enter username"
                class="auth-input"
                autocomplete="username"
              />
            </div>
            <p *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="field-error">Username is required</p>
          </div>

          <!-- Password -->
          <div class="input-group">
            <label class="input-label">Password</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                id="login-password"
                placeholder="Enter password"
                class="auth-input"
                autocomplete="current-password"
              />
              <button type="button" (click)="showPassword = !showPassword" class="eye-btn">
                <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
              </button>
            </div>
            <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="field-error">Password is required</p>
          </div>

          <!-- Error -->
          <div *ngIf="authError" class="error-banner">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            Invalid username or password
          </div>

          <!-- Submit -->
          <button
            type="submit"
            id="login-submit-btn"
            [disabled]="loginForm.invalid || isLoading"
            class="login-btn w-full"
          >
            <span *ngIf="!isLoading">Sign In</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Authenticating...
            </span>
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="demo-hint mt-6">
          <p class="text-xs text-slate-500 text-center">
            Demo credentials: <span class="text-slate-300 font-mono">admin</span> / <span class="text-slate-300 font-mono">weather123</span>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-bg {
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
      position: relative;
      overflow: hidden;
    }
    .particles { position: absolute; inset: 0; pointer-events: none; }
    .particles span {
      position: absolute;
      width: 6px; height: 6px;
      background: rgba(59,130,246,0.3);
      border-radius: 50%;
      animation: float 8s infinite;
    }
    .particles span:nth-child(1) { top: 10%; left: 15%; animation-delay: 0s; width: 8px; height: 8px; }
    .particles span:nth-child(2) { top: 70%; left: 80%; animation-delay: 1s; width: 5px; height: 5px; }
    .particles span:nth-child(3) { top: 40%; left: 60%; animation-delay: 2s; width: 10px; height: 10px; background: rgba(99,102,241,0.25); }
    .particles span:nth-child(4) { top: 80%; left: 20%; animation-delay: 3s; }
    .particles span:nth-child(5) { top: 20%; left: 75%; animation-delay: 1.5s; width: 4px; height: 4px; }
    .particles span:nth-child(6) { top: 55%; left: 10%; animation-delay: 2.5s; width: 7px; height: 7px; }
    .particles span:nth-child(7) { top: 30%; left: 40%; animation-delay: 4s; width: 5px; height: 5px; background: rgba(139,92,246,0.2); }
    .particles span:nth-child(8) { top: 90%; left: 55%; animation-delay: 0.5s; width: 6px; height: 6px; }
    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
      50% { transform: translateY(-30px) scale(1.2); opacity: 0.8; }
    }
    .login-card {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset;
    }
    .logo-icon {
      width: 64px; height: 64px;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 24px rgba(59,130,246,0.35);
    }
    .input-group { display: flex; flex-direction: column; gap: 6px; }
    .input-label { font-size: 0.8rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
    .input-wrapper { position: relative; }
    .input-icon {
      position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
      color: #475569; display: flex; align-items: center;
    }
    .auth-input {
      width: 100%;
      padding: 12px 44px 12px 44px;
      background: rgba(15,23,42,0.6);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      color: #f8fafc;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s;
    }
    .auth-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
      background: rgba(15,23,42,0.8);
    }
    .auth-input::placeholder { color: #475569; }
    .eye-btn {
      position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
      color: #475569; background: none; border: none; cursor: pointer; display: flex; align-items: center;
      transition: color 0.2s;
    }
    .eye-btn:hover { color: #94a3b8; }
    .field-error { font-size: 0.75rem; color: #f87171; }
    .error-banner {
      display: flex; align-items: center; gap: 8px;
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.3);
      color: #f87171;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 0.875rem;
    }
    .login-btn {
      padding: 13px;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      border: none;
      border-radius: 12px;
      color: white;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(59,130,246,0.3);
    }
    .login-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(59,130,246,0.4);
      filter: brightness(1.05);
    }
    .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .login-btn:active:not(:disabled) { transform: scale(0.98); }
  `]
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  authError = false;
  isLoading = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.authError = false;
    const { username, password } = this.loginForm.value;
    setTimeout(() => {
      const success = this.auth.login(username!, password!);
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.authError = true;
        this.isLoading = false;
      }
    }, 800);
  }
}
