import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="loader-container">
      <!-- Solid Blue Progress Bar -->
      <div class="progress-bar-track">
        <div class="progress-bar-fill"></div>
      </div>

      <!-- Animated weather icons -->
      <div class="loader-icons">
        <div class="loader-icon-wrap icon-1">☁️</div>
        <div class="loader-icon-wrap icon-2">⛅</div>
        <div class="loader-icon-wrap icon-3">🌤️</div>
      </div>

      <p class="loader-text">Fetching climate analytics...</p>

      <!-- Skeleton cards -->
      <div class="skeleton-grid">
        <div class="skeleton-card" *ngFor="let i of [1,2,3,4]">
          <div class="skeleton-line w-2/3"></div>
          <div class="skeleton-circle"></div>
          <div class="skeleton-line w-1/2"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      gap: 1.5rem;
    }
    .progress-bar-track {
      width: 100%;
      max-width: 360px;
      height: 4px;
      background: rgba(15,23,42,0.8);
      border-radius: 99px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(59,130,246,0.2);
    }
    .progress-bar-fill {
      height: 100%;
      width: 100%;
      background: #3b82f6; /* Solid blue as per spec */
      border-radius: 99px;
      animation: progress 1.6s infinite ease-in-out;
    }
    @keyframes progress {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .loader-icons {
      display: flex;
      gap: 12px;
    }
    .loader-icon-wrap {
      font-size: 1.5rem;
      animation: bounce 1.4s infinite ease-in-out;
    }
    .icon-1 { animation-delay: 0s; }
    .icon-2 { animation-delay: 0.2s; }
    .icon-3 { animation-delay: 0.4s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
    }
    .loader-text {
      color: #475569;
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      width: 100%;
      max-width: 480px;
    }
    .skeleton-card {
      background: rgba(30,41,59,0.5);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 14px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .skeleton-line {
      height: 10px;
      background: linear-gradient(90deg, rgba(51,65,85,0.4) 25%, rgba(71,85,105,0.6) 50%, rgba(51,65,85,0.4) 75%);
      background-size: 200% 100%;
      border-radius: 99px;
      animation: shimmer 1.5s infinite;
    }
    .skeleton-circle {
      width: 48px; height: 48px;
      border-radius: 50%;
      background: linear-gradient(90deg, rgba(51,65,85,0.4) 25%, rgba(71,85,105,0.6) 50%, rgba(51,65,85,0.4) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
  imports: [CommonModule]
})
export class LoaderComponent {}
