import { Component, Input } from '@angular/core';
import { ForecastDay } from '../../services/weather';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full" *ngIf="forecast && forecast.length > 0">
      <h3 class="text-lg font-bold text-white mb-4 tracking-tight pl-1">5-Day Extended Forecast</h3>
      
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div 
          *ngFor="let day of forecast" 
          class="glass-panel flex flex-col items-center p-5 hover:bg-slate-800/40 hover:-translate-y-1 transition-all duration-200"
        >
          <div class="text-xs font-semibold text-slate-400 mb-2">
            {{ day.date | date:'EEE, MMM d' }}
          </div>
          <img [src]="day.icon" alt="weather icon" class="w-16 h-16 drop-shadow select-none"/>
          <div class="text-lg font-bold text-white mt-1">
            {{ day.avgTemp | number:'1.0-1' }}°C
          </div>
        </div>
      </div>
    </div>
  `
})
export class ForecastComponent {
  @Input() forecast: ForecastDay[] | null = null;
}
