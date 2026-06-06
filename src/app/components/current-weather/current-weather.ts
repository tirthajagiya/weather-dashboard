import { Component, Input } from '@angular/core';
import { WeatherData } from '../../services/weather';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-panel w-full p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6" *ngIf="weather">
      <div class="text-center sm:text-left">
        <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1">{{ weather.city }}</h2>
        <p class="text-slate-400 text-sm sm:text-base capitalize">{{ weather.description }}</p>
      </div>
      <div class="flex items-center gap-4">
        <img [src]="weather.icon" alt="weather icon" class="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md select-none"/>
        <div class="flex items-start">
          <span class="text-5xl sm:text-6xl font-extrabold tracking-tighter text-white leading-none">
            {{ weather.temp | number:'1.0-1' }}
          </span>
          <span class="text-lg sm:text-xl font-bold text-blue-500 ml-1">°C</span>
        </div>
      </div>
    </div>
  `
})
export class CurrentWeatherComponent {
  @Input() weather: WeatherData | null = null;
}
