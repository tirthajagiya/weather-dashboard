import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../services/weather';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="weather" class="current-weather-card">
      <!-- Header row: City + Location badge -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
            {{ weather.city }}
          </h2>
          <p class="text-slate-400 text-base mt-1 capitalize font-medium">
            {{ weather.country }} &bull; {{ weather.description }}
          </p>
        </div>

        <!-- Temperature hero -->
        <div class="flex items-center gap-3">
          <img [src]="weather.icon" alt="weather icon" class="w-20 h-20 drop-shadow-lg select-none -my-2"/>
          <div class="flex items-start">
            <span class="text-6xl sm:text-7xl font-black text-white leading-none">
              {{ weather.temp | number:'1.0-1' }}
            </span>
            <span class="text-2xl font-bold text-blue-400 mt-2 ml-1">°C</span>
          </div>
        </div>
      </div>

      <!-- Metrics grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="metric-tile">
          <div class="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
          </div>
          <div class="metric-value">{{ weather.feelsLike | number:'1.0-1' }}°C</div>
          <div class="metric-label">Feels Like</div>
        </div>

        <div class="metric-tile">
          <div class="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v8"/><path d="M12 22v-4"/><path d="M4.93 4.93 8 8"/><path d="m16 16 3.07 3.07"/><path d="M2 12h8"/><path d="M22 12h-4"/><path d="m4.93 19.07 3.07-3.07"/><path d="m16 8 3.07-3.07"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div class="metric-value">{{ weather.humidity }}%</div>
          <div class="metric-label">Humidity</div>
        </div>

        <div class="metric-tile">
          <div class="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>
          </div>
          <div class="metric-value">{{ weather.windSpeed | number:'1.0-1' }} m/s</div>
          <div class="metric-label">Wind Speed</div>
        </div>

        <div class="metric-tile">
          <div class="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          </div>
          <div class="flex flex-col">
            <div class="text-xs text-slate-300 font-semibold">{{ weather.sunrise * 1000 | date:'h:mm a' }}</div>
            <div class="metric-label">Sunrise</div>
            <div class="text-xs text-slate-300 font-semibold mt-1">{{ weather.sunset * 1000 | date:'h:mm a' }}</div>
            <div class="metric-label">Sunset</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .current-weather-card {
      background: rgba(30, 41, 59, 0.65);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.25);
    }
    .metric-tile {
      background: rgba(15,23,42,0.5);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .metric-icon { color: #3b82f6; margin-bottom: 4px; }
    .metric-value { font-size: 1.1rem; font-weight: 700; color: #f8fafc; }
    .metric-label { font-size: 0.7rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
  `]
})
export class CurrentWeatherComponent {
  @Input() weather: WeatherData | null = null;
}
