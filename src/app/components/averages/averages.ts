import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayAverage } from '../../services/weather';

@Component({
  selector: 'app-averages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="averages && averages.length > 0" class="averages-card">
      <h3 class="text-base font-bold text-slate-300 mb-4 tracking-widest uppercase flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-indigo-400"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        4-Day Average Analytics
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div *ngFor="let avg of averages" class="avg-tile">
          <div class="avg-day">{{ avg.date | date:'EEEE' }}</div>
          <div class="avg-date-sub">{{ avg.date | date:'MMM d' }}</div>
          <div class="avg-temp-value">
            {{ avg.avgTemp | number:'1.0-1' }}
            <span class="avg-unit">°C</span>
          </div>
          <div class="avg-label">Avg Temp</div>
          <!-- Mini temperature bar -->
          <div class="temp-bar-bg">
            <div class="temp-bar-fill" [style.width.%]="getBarWidth(avg.avgTemp)"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .averages-card {
      background: rgba(30,41,59,0.5);
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 20px;
      padding: 1.5rem;
    }
    .avg-tile {
      background: rgba(15,23,42,0.5);
      border: 1px solid rgba(99,102,241,0.1);
      border-radius: 14px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .avg-day { font-size: 0.8rem; font-weight: 700; color: #a5b4fc; }
    .avg-date-sub { font-size: 0.68rem; color: #475569; font-weight: 500; margin-bottom: 6px; }
    .avg-temp-value { font-size: 1.5rem; font-weight: 800; color: #f8fafc; line-height: 1; }
    .avg-unit { font-size: 0.9rem; color: #6366f1; font-weight: 600; }
    .avg-label { font-size: 0.65rem; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; margin-top: 2px; }
    .temp-bar-bg {
      margin-top: 10px;
      height: 4px;
      background: rgba(99,102,241,0.15);
      border-radius: 99px;
      overflow: hidden;
    }
    .temp-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1, #3b82f6);
      border-radius: 99px;
      transition: width 0.6s ease;
    }
  `]
})
export class AveragesComponent {
  @Input() averages: DayAverage[] | null = null;

  /** Map temperature to a bar width between 10–100% (for visual range) */
  getBarWidth(temp: number): number {
    // Assume range -10°C to 50°C
    const min = -10, max = 50;
    const clamped = Math.min(Math.max(temp, min), max);
    return Math.round(((clamped - min) / (max - min)) * 90) + 10;
  }
}
