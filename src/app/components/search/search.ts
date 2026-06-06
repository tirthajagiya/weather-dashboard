import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="search-container w-full max-w-2xl mx-auto">
      <div class="search-wrapper">
        <!-- Search icon -->
        <span class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </span>

        <input
          type="text"
          id="city-search-input"
          [formControl]="searchControl"
          (keyup.enter)="triggerManualSearch()"
          placeholder="Search for a city..."
          class="search-input"
          autocomplete="off"
        />

        <!-- Clear button -->
        <button
          *ngIf="searchControl.value"
          type="button"
          (click)="clearSearch()"
          class="clear-btn"
          title="Clear search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <!-- Location pin button -->
        <button
          type="button"
          id="use-location-btn"
          (click)="requestLocation.emit()"
          class="location-btn"
          title="Use my location"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a7 7 0 0 1 7 7c0 4.97-7 13-7 13S5 13.97 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
        </button>

        <!-- Search button -->
        <button
          type="button"
          id="search-submit-btn"
          (click)="triggerManualSearch()"
          class="search-btn"
        >
          Search
        </button>
      </div>
    </div>
  `,
  styles: [`
    .search-container { padding: 0 2px; }
    .search-wrapper {
      display: flex;
      align-items: center;
      background: rgba(15,23,42,0.7);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 16px;
      padding: 0 6px 0 0;
      transition: all 0.2s;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    }
    .search-wrapper:focus-within {
      border-color: rgba(59,130,246,0.5);
      box-shadow: 0 0 0 3px rgba(59,130,246,0.12), 0 4px 16px rgba(0,0,0,0.2);
    }
    .search-icon {
      padding: 0 14px;
      color: #475569;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    .search-input {
      flex: 1;
      padding: 14px 0;
      background: transparent;
      border: none;
      outline: none;
      color: #f8fafc;
      font-size: 0.95rem;
      min-width: 0;
    }
    .search-input::placeholder { color: #475569; }
    .clear-btn {
      color: #475569;
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      transition: color 0.2s;
    }
    .clear-btn:hover { color: #94a3b8; }
    .location-btn {
      color: #3b82f6;
      background: rgba(59,130,246,0.1);
      border: 1px solid rgba(59,130,246,0.2);
      cursor: pointer;
      padding: 8px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin: 6px 4px;
      transition: all 0.2s;
    }
    .location-btn:hover {
      background: rgba(59,130,246,0.2);
      color: #60a5fa;
    }
    .search-btn {
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      border: none;
      border-radius: 10px;
      color: white;
      font-weight: 700;
      font-size: 0.875rem;
      padding: 10px 20px;
      cursor: pointer;
      flex-shrink: 0;
      margin: 6px 0;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(59,130,246,0.25);
    }
    .search-btn:hover {
      filter: brightness(1.1);
      box-shadow: 0 4px 12px rgba(59,130,246,0.35);
    }
    .search-btn:active { transform: scale(0.97); }
  `]
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  private searchSubject = new Subject<string>();
  private sub: Subscription | null = null;

  @Input() set query(val: string) {
    if (val) this.searchControl.setValue(val, { emitEvent: false });
  }

  @Output() search = new EventEmitter<string>();
  @Output() requestLocation = new EventEmitter<void>();

  ngOnInit() {
    // RxJS Stream Architecture: debounceTime to choke fast input triggers
    this.sub = this.searchSubject.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      filter(val => val.trim().length >= 2)
    ).subscribe(query => {
      this.search.emit(query.trim());
    });

    this.searchControl.valueChanges.subscribe(val => {
      if (val !== null) this.searchSubject.next(val);
    });
  }

  triggerManualSearch() {
    const val = this.searchControl.value;
    if (val && val.trim().length > 0) {
      this.search.emit(val.trim());
    }
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
