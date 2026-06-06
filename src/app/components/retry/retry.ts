import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retry',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="retry-card">
      <div class="retry-icon-ring">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <path d="M12 9v4"/>
          <path d="M12 17h.01"/>
        </svg>
      </div>
      <div class="text-center">
        <h3 class="retry-title">Request Failed</h3>
        <p class="retry-message">{{ message }}</p>
      </div>
      <button id="retry-btn" (click)="onRetry.emit()" class="retry-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        Retry Connection
      </button>
    </div>
  `,
  styles: [`
    .retry-card {
      max-width: 420px;
      margin: 2rem auto;
      background: rgba(234,179,8,0.05);
      border: 1px solid rgba(234,179,8,0.3);
      border-radius: 20px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      box-shadow: 0 0 40px rgba(234,179,8,0.08);
    }
    .retry-icon-ring {
      width: 72px; height: 72px;
      border-radius: 50%;
      background: rgba(234,179,8,0.1);
      border: 2px solid rgba(234,179,8,0.3);
      display: flex; align-items: center; justify-content: center;
      color: #eab308;
      animation: pulse-ring 2s infinite;
    }
    @keyframes pulse-ring {
      0%, 100% { box-shadow: 0 0 0 0 rgba(234,179,8,0.2); }
      50% { box-shadow: 0 0 0 12px rgba(234,179,8,0); }
    }
    .retry-title { font-size: 1.15rem; font-weight: 800; color: #eab308; margin-bottom: 6px; }
    .retry-message { font-size: 0.875rem; color: #94a3b8; line-height: 1.6; }
    .retry-btn {
      display: flex; align-items: center; gap: 8px;
      background: #eab308;
      color: #0f172a;
      border: none;
      border-radius: 12px;
      font-weight: 800;
      font-size: 0.9rem;
      padding: 12px 24px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(234,179,8,0.25);
    }
    .retry-btn:hover {
      background: #fbbf24;
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(234,179,8,0.35);
    }
    .retry-btn:active { transform: scale(0.97); }
  `]
})
export class RetryComponent {
  @Input() message = 'Failed to retrieve weather metrics.';
  @Output() onRetry = new EventEmitter<void>();
}
