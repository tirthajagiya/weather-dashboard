import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-retry',
  standalone: true,
  template: `
    <div class="glass-panel border-yellow-500/30 bg-yellow-500/5 max-w-md mx-auto p-6 flex flex-col items-center text-center gap-4 animate-fade-in">
      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <div>
        <h3 class="text-lg font-bold text-yellow-500 mb-1">Request Failure</h3>
        <p class="text-slate-400 text-sm leading-relaxed">{{ message }}</p>
      </div>
      <button 
        class="mt-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-yellow-500/10 active:scale-[0.98] transition-all duration-200" 
        (click)="onRetry.emit()"
      >
        Retry Connection
      </button>
    </div>
  `
})
export class RetryComponent {
  @Input() message = 'Failed to retrieve weather metrics.';
  @Output() onRetry = new EventEmitter<void>();
}
