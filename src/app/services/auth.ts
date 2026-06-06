import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_KEY = 'aeroCast_auth';
  private readonly VALID_CREDENTIALS = { username: 'admin', password: 'weather123' };

  login(username: string, password: string): boolean {
    if (
      username.trim() === this.VALID_CREDENTIALS.username &&
      password === this.VALID_CREDENTIALS.password
    ) {
      sessionStorage.setItem(this.SESSION_KEY, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.SESSION_KEY) === 'true';
  }
}
