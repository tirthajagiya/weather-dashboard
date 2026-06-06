import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-16 px-4 text-center gap-6">
      <!-- Blue background progress bar / preload bar while pipeline requests are pending -->
      <div class="w-full max-w-[300px] h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
        <div class="absolute top-0 left-0 h-full w-full bg-blue-500 origin-left animate-[progress_1.5s_infinite_ease-in-out]"></div>
      </div>
      <p class="text-slate-400 text-sm font-semibold tracking-wide animate-pulse">
        Fetching climate analytics...
      </p>
    </div>
  `,
  styles: [`
    @keyframes progress {
      0% { transform: scaleX(0); transform-origin: left; }
      50% { transform: scaleX(1); transform-origin: left; }
      50.1% { transform: scaleX(1); transform-origin: right; }
      100% { transform: scaleX(0); transform-origin: right; }
    }
  `]
})
export class LoaderComponent {}
