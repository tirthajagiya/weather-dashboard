import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AuthService] });
    service = TestBed.inject(AuthService);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn() returns false when no session exists', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('login() returns false for invalid credentials', () => {
    const result = service.login('wrongUser', 'wrongPass');
    expect(result).toBeFalse();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('login() returns false for correct username but wrong password', () => {
    const result = service.login('admin', 'wrongPass');
    expect(result).toBeFalse();
  });

  it('login() returns true for valid credentials and sets session', () => {
    const result = service.login('admin', 'weather123');
    expect(result).toBeTrue();
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('logout() clears session and isLoggedIn() returns false', () => {
    service.login('admin', 'weather123');
    expect(service.isLoggedIn()).toBeTrue();
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('login() rejects empty username', () => {
    const result = service.login('', 'weather123');
    expect(result).toBeFalse();
  });
});
