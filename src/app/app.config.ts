import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter([
      {
        path: 'login',
        loadComponent: () =>
          import('./components/auth/login').then(m => m.LoginComponent)
      },
      {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./components/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      { path: '**', redirectTo: '' }
    ])
  ]
};
