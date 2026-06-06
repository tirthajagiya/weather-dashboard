import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, WeatherData, ForecastDay } from '../../services/weather';
import { SearchComponent } from '../search/search';
import { CurrentWeatherComponent } from '../current-weather/current-weather';
import { ForecastComponent } from '../forecast/forecast';
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
    LoaderComponent, 
    RetryComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pb-16">
      <!-- Top Premium Navbar -->
      <nav class="border-b border-white/5 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <span class="text-xl font-bold tracking-tight text-white">Aero<span class="text-blue-500">Cast</span></span>
          </div>
        </div>
      </nav>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <header class="text-center mb-10">
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Weather Analytics</h1>
          <p class="text-slate-400 max-w-md mx-auto text-sm sm:text-base">
            Search for a city or allow location services to retrieve detailed climate forecasts.
          </p>
        </header>

        <div class="mb-10">
          <app-search (search)="onSearch($event)"></app-search>
        </div>

        <main class="min-h-[400px]">
          <app-loader *ngIf="loading"></app-loader>
          
          <app-retry 
            *ngIf="error && !loading" 
            [message]="errorMessage" 
            (onRetry)="retryFetch()"
          ></app-retry>
          
          <div *ngIf="!loading && !error && weather" class="space-y-8">
            <app-current-weather [weather]="weather"></app-current-weather>
            <app-forecast [forecast]="forecast"></app-forecast>
          </div>
        </main>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  weather: WeatherData | null = null;
  forecast: ForecastDay[] | null = null;
  loading = true;
  error = false;
  errorMessage = '';
  lastQuery: string | {lat: number, lon: number} = 'Bengaluru';
  private defaultCityTimer: any;

  constructor(
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.getUserLocation();
    this.startDefaultCityTimer();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.clearDefaultCityTimer();
          this.lastQuery = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          this.fetchData();
        },
        () => {
          this.lastQuery = 'Bengaluru';
          this.fetchData();
        },
        { timeout: 4000 }
      );
    } else {
      this.lastQuery = 'Bengaluru';
      this.fetchData();
    }
  }

  startDefaultCityTimer() {
    this.defaultCityTimer = setTimeout(() => {
      if (!this.weather && !this.error) {
        this.lastQuery = 'Bengaluru';
        this.fetchData();
      }
    }, 8000);
  }

  clearDefaultCityTimer() {
    if (this.defaultCityTimer) {
      clearTimeout(this.defaultCityTimer);
    }
  }

  onSearch(city: string) {
    this.clearDefaultCityTimer();
    this.lastQuery = city;
    this.fetchData();
  }

  retryFetch() {
    this.fetchData();
  }

  private fetchData() {
    this.loading = true;
    this.error = false;
    this.clearDefaultCityTimer();
    
    const request = typeof this.lastQuery === 'string'
      ? {
          weather: this.weatherService.getCurrentWeather(this.lastQuery),
          forecast: this.weatherService.getForecast(this.lastQuery)
        }
      : {
          weather: this.weatherService.getCurrentWeatherByCoords(this.lastQuery.lat, this.lastQuery.lon),
          forecast: this.weatherService.getForecastByCoords(this.lastQuery.lat, this.lastQuery.lon)
        };

    forkJoin(request)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.weather = res.weather;
          this.forecast = res.forecast;
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
