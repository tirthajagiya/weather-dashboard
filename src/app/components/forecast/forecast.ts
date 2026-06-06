import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastDay } from '../../services/weather';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full" *ngIf="forecast && forecast.length > 0">
      <h3 class="text-base font-bold text-slate-300 mb-4 tracking-widest uppercase pl-1 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        7-Day Extended Forecast
      </h3>

      <div class="forecast-scroll">
        <div class="forecast-track">
          <div
            *ngFor="let day of forecast; let i = index"
            [class.today-card]="isToday(day.date)"
            class="forecast-card"
          >
            <div class="day-label">
              <span *ngIf="isToday(day.date)" class="today-badge">Today</span>
              <span *ngIf="!isToday(day.date)">{{ day.date | date:'EEE' }}</span>
            </div>
            <div class="day-date">{{ day.date | date:'MMM d' }}</div>
            <img [src]="day.icon" [alt]="day.description" class="forecast-icon select-none"/>
            <div class="temp-range">
              <span class="temp-max">{{ day.maxTemp | number:'1.0-0' }}°</span>
              <span class="temp-divider">/</span>
              <span class="temp-min">{{ day.minTemp | number:'1.0-0' }}°</span>
            </div>
            <div class="avg-temp">Avg {{ day.avgTemp | number:'1.0-1' }}°C</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forecast-scroll {
      overflow-x: auto;
      padding-bottom: 8px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: rgba(59,130,246,0.3) transparent;
    }
    .forecast-scroll::-webkit-scrollbar { height: 4px; }
    .forecast-scroll::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 4px; }
    .forecast-track {
      display: flex;
      gap: 12px;
      min-width: max-content;
      padding: 4px 2px;
    }
    .forecast-card {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px;
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      min-width: 110px;
      transition: all 0.2s;
      cursor: default;
    }
    .forecast-card:hover {
      background: rgba(59,130,246,0.08);
      border-color: rgba(59,130,246,0.2);
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    }
    .today-card {
      background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.15));
      border-color: rgba(59,130,246,0.4);
      box-shadow: 0 0 0 1px rgba(59,130,246,0.15);
    }
    .today-badge {
      background: #3b82f6;
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 99px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .day-label { font-size: 0.85rem; font-weight: 700; color: #f8fafc; min-height: 22px; display: flex; align-items: center; }
    .day-date { font-size: 0.7rem; color: #64748b; font-weight: 500; }
    .forecast-icon { width: 56px; height: 56px; }
    .temp-range { display: flex; align-items: center; gap: 3px; }
    .temp-max { font-size: 1rem; font-weight: 700; color: #f8fafc; }
    .temp-min { font-size: 0.85rem; font-weight: 500; color: #64748b; }
    .temp-divider { color: #334155; font-size: 0.85rem; }
    .avg-temp { font-size: 0.68rem; color: #3b82f6; font-weight: 600; letter-spacing: 0.02em; }
  `]
})
export class ForecastComponent {
  @Input() forecast: ForecastDay[] | null = null;

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }
}
