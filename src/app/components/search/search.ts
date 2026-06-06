import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="flex items-center gap-3 w-full max-w-xl mx-auto">
      <div class="relative flex-1">
        <input 
          type="text" 
          [formControl]="searchControl"
          (keyup.enter)="triggerManualSearch()"
          placeholder="Enter city name..."
          class="w-full px-5 py-3.5 pl-12 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-md text-base"
        />
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>
      <button 
        (click)="triggerManualSearch()" 
        class="flex items-center justify-center p-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all duration-200"
      >
        Search
      </button>
    </div>
  `
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  private searchSubject = new Subject<string>();
  private sub: Subscription | null = null;

  @Input() set query(val: string) {
    if (val) {
      this.searchControl.setValue(val, { emitEvent: false });
    }
  }

  @Output() search = new EventEmitter<string>();

  ngOnInit() {
    // 1. RxJS Stream Architecture: debounceTime on typing
    this.sub = this.searchSubject.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      filter(val => val.trim().length > 0)
    ).subscribe(query => {
      this.search.emit(query.trim());
    });

    // Feed changes into our subject stream
    this.searchControl.valueChanges.subscribe(val => {
      if (val !== null) {
        this.searchSubject.next(val);
      }
    });
  }

  triggerManualSearch() {
    const val = this.searchControl.value;
    if (val && val.trim().length > 0) {
      this.search.emit(val.trim());
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
