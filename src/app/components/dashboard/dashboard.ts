import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WeatherService, WeatherData, ForecastDay, DayAverage } from '../../services/weather';
import { AuthService } from '../../services/auth';
import { SearchComponent } from '../search/search';
import { CurrentWeatherComponent } from '../current-weather/current-weather';
import { ForecastComponent } from '../forecast/forecast';
import { AveragesComponent } from '../averages/averages';
import { LoaderComponent } from '../loader/loader';
import { RetryComponent } from '../retry/retry';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    CurrentWeatherComponent,
    ForecastComponent,
    AveragesComponent,
    LoaderComponent,
    RetryComponent
  ],
  template: `
    <div class="min-h-screen dashboard-bg text-white pb-16">

      <!-- Sticky Navbar -->
      <nav class="navbar">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-2.5">
            <div class="nav-logo">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <span class="text-xl font-extrabold tracking-tight text-white">
              Aero<span class="text-blue-400">Cast</span>
            </span>
          </div>

          <!-- Right side: location chip + logout -->
          <div class="flex items-center gap-3">
            <!-- Location status chip -->
            <div *ngIf="weather" class="location-chip">
              <svg *ngIf="usingRealLocation" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-green-400"><path d="M12 2a7 7 0 0 1 7 7c0 4.97-7 13-7 13S5 13.97 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              <svg *ngIf="!usingRealLocation" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              <span class="hidden sm:inline text-xs font-semibold">
                {{ usingRealLocation ? 'Your Location' : 'Default City' }}
              </span>
            </div>

            <!-- Logout -->
            <button id="logout-btn" (click)="logout()" class="logout-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              <span class="hidden sm:inline text-xs font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <!-- Header -->
        <header class="text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Weather Analytics
          </h1>
          <p class="text-slate-400 max-w-md mx-auto text-sm">
            Search for any city or allow location services to retrieve real-time climate data.
          </p>
        </header>

        <!-- Search -->
        <div class="mb-8">
          <app-search
            [query]="weather?.city || ''"
            (search)="onSearch($event)"
            (requestLocation)="retryLocation()"
          ></app-search>
        </div>

        <!-- Main content -->
        <main class="min-h-[400px] space-y-6">
          <app-loader *ngIf="loading"></app-loader>

          <app-retry
            *ngIf="error && !loading"
            [message]="errorMessage"
            (onRetry)="retryFetch()"
          ></app-retry>

          <ng-container *ngIf="!loading && !error && weather">
            <app-current-weather [weather]="weather"></app-current-weather>
            <app-forecast [forecast]="forecast"></app-forecast>
            <app-averages [averages]="averages"></app-averages>
          </ng-container>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-bg {
      background: linear-gradient(160deg, #0f172a 0%, #1e1b4b 45%, #0f172a 100%);
      position: relative;
    }
    .navbar {
      border-bottom: 1px solid rgba(255,255,255,0.05);
      background: rgba(15,23,42,0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .nav-logo {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(59,130,246,0.3);
    }
    .location-chip {
      display: flex; align-items: center; gap: 5px;
      background: rgba(30,41,59,0.7);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 99px;
      padding: 5px 12px;
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .logout-btn {
      display: flex; align-items: center; gap: 5px;
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.2);
      color: #f87171;
      border-radius: 99px;
      padding: 6px 14px;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 600;
      transition: all 0.2s;
    }
    .logout-btn:hover {
      background: rgba(239,68,68,0.2);
      border-color: rgba(239,68,68,0.4);
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  weather: WeatherData | null = null;
  forecast: ForecastDay[] | null = null;
  averages: DayAverage[] | null = null;
  loading = true;
  error = false;
  errorMessage = '';
  usingRealLocation = false;

  lastQuery: string | { lat: number; lon: number } = 'Bengaluru';
  private defaultCityTimer: any;
  private hasFetchedLocation = false;
  private userSearched = false;

  constructor(
    private weatherService: WeatherService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUserLocation();
    this.startDefaultCityTimer();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (this.userSearched) return;
          this.hasFetchedLocation = true;
          this.usingRealLocation = true;
          this.clearDefaultCityTimer();
          this.lastQuery = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          this.fetchData();
        },
        () => {
          if (this.userSearched) return;
          if (!this.hasFetchedLocation && !this.weather) {
            this.clearDefaultCityTimer();
            this.usingRealLocation = false;
            this.lastQuery = 'Bengaluru';
            this.fetchData();
          }
        },
        { timeout: 15000 }
      );
    } else {
      this.lastQuery = 'Bengaluru';
      this.fetchData();
    }
  }

  retryLocation() {
    this.userSearched = false;
    this.hasFetchedLocation = false;
    this.usingRealLocation = false;
    this.getUserLocation();
  }

  startDefaultCityTimer() {
    this.defaultCityTimer = setTimeout(() => {
      if (!this.hasFetchedLocation && !this.weather && !this.userSearched) {
        this.usingRealLocation = false;
        this.lastQuery = 'Bengaluru';
        this.fetchData();
      }
    }, 5000);
  }

  clearDefaultCityTimer() {
    if (this.defaultCityTimer) clearTimeout(this.defaultCityTimer);
  }

  onSearch(city: string) {
    this.userSearched = true;
    this.usingRealLocation = false;
    this.clearDefaultCityTimer();
    this.lastQuery = city;
    this.fetchData();
  }

  retryFetch() {
    this.fetchData();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private fetchData() {
    this.loading = true;
    this.error = false;

    const request =
      typeof this.lastQuery === 'string'
        ? {
            weather: this.weatherService.getCurrentWeather(this.lastQuery),
            forecast: this.weatherService.getForecast(this.lastQuery)
          }
        : {
            weather: this.weatherService.getCurrentWeatherByCoords(this.lastQuery.lat, this.lastQuery.lon),
            forecast: this.weatherService.getForecastByCoords(this.lastQuery.lat, this.lastQuery.lon)
          };

    forkJoin(request)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.weather = res.weather;
          this.forecast = res.forecast;
          this.averages = this.weatherService.getAverages(res.forecast);
        },
        error: (err) => {
          this.error = true;
          this.errorMessage = err.message || 'Failed to retrieve weather metrics.';
        }
      });
  }

  ngOnDestroy() {
    this.clearDefaultCityTimer();
  }
}
