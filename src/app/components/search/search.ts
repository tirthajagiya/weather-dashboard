import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { WeatherService, CitySuggestion } from '../../services/weather';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="search-container w-full max-w-2xl mx-auto" (click)="$event.stopPropagation()">
      <div class="search-wrapper" [class.focused]="isFocused">

        <!-- Search icon -->
        <span class="search-icon" [class.active]="isFocused">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </span>

        <input
          type="text"
          id="city-search-input"
          [formControl]="searchControl"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (keydown)="onKeyDown($event)"
          (keyup.enter)="onEnter()"
          (keyup.escape)="closeSuggestions()"
          placeholder="Search for any city worldwide..."
          class="search-input"
          autocomplete="off"
          role="combobox"
          [attr.aria-expanded]="showDropdown"
          aria-haspopup="listbox"
        />

        <!-- Loading spinner -->
        <span *ngIf="isLoadingSuggestions" class="suggest-spinner">
          <svg class="animate-spin h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </span>

        <!-- Clear button -->
        <button
          *ngIf="searchControl.value && !isLoadingSuggestions"
          type="button"
          (click)="clearSearch()"
          class="clear-btn"
          title="Clear"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <!-- Location pin button -->
        <button
          type="button"
          id="use-location-btn"
          (click)="onLocationClick()"
          class="location-btn"
          title="Use my current location"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a7 7 0 0 1 7 7c0 4.97-7 13-7 13S5 13.97 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
        </button>

        <!-- Search button -->
        <button
          type="button"
          id="search-submit-btn"
          (click)="onEnter()"
          class="search-btn"
        >
          Search
        </button>
      </div>

      <!-- ─── Autocomplete Dropdown ─── -->
      <div
        *ngIf="showDropdown"
        class="suggestions-dropdown"
        role="listbox"
        id="city-suggestions-list"
      >
        <!-- Suggestions list -->
        <ng-container *ngIf="suggestions.length > 0">
          <div class="suggestions-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            City suggestions
          </div>
          <div
            *ngFor="let s of suggestions; let i = index"
            class="suggestion-item"
            [class.highlighted]="i === activeIndex"
            (mousedown)="selectSuggestion(s)"
            (mouseover)="activeIndex = i"
            role="option"
            [id]="'suggestion-' + i"
          >
            <!-- Country flag emoji from country code -->
            <span class="flag">{{ getFlagEmoji(s.country) }}</span>
            <div class="suggest-text">
              <span class="city-name">{{ s.name }}</span>
              <span class="city-sub" *ngIf="s.state">{{ s.state }}, </span>
              <span class="city-sub">{{ s.country }}</span>
            </div>
            <span class="suggest-coords">
              {{ s.lat | number:'1.1-1' }}°, {{ s.lon | number:'1.1-1' }}°
            </span>
          </div>
        </ng-container>

        <!-- No results -->
        <div *ngIf="suggestions.length === 0 && !isLoadingSuggestions && hasSearched" class="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/></svg>
          <span>No cities found for "{{ searchControl.value }}"</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      position: relative;
      padding: 0 2px;
    }
    .search-wrapper {
      display: flex;
      align-items: center;
      background: rgba(15,23,42,0.75);
      border: 1.5px solid rgba(255,255,255,0.09);
      border-radius: 16px;
      padding: 0 6px 0 0;
      transition: all 0.25s;
      backdrop-filter: blur(16px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }
    .search-wrapper.focused {
      border-color: rgba(59,130,246,0.55);
      box-shadow: 0 0 0 4px rgba(59,130,246,0.1), 0 4px 20px rgba(0,0,0,0.25);
    }
    .search-icon {
      padding: 0 14px;
      color: #475569;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      transition: color 0.2s;
    }
    .search-icon.active { color: #3b82f6; }
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
    .suggest-spinner {
      padding: 0 8px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
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
      transition: color 0.2s, background 0.2s;
    }
    .clear-btn:hover { color: #94a3b8; background: rgba(255,255,255,0.05); }
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
    .location-btn:hover { background: rgba(59,130,246,0.2); color: #60a5fa; transform: scale(1.05); }
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
      box-shadow: 0 2px 8px rgba(59,130,246,0.3);
      white-space: nowrap;
    }
    .search-btn:hover { filter: brightness(1.1); box-shadow: 0 4px 14px rgba(59,130,246,0.4); }
    .search-btn:active { transform: scale(0.97); }

    /* ── Dropdown ── */
    .suggestions-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0; right: 0;
      background: rgba(15,23,42,0.97);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.1);
      z-index: 1000;
      overflow: hidden;
      animation: dropIn 0.18s ease-out;
    }
    @keyframes dropIn {
      from { opacity: 0; transform: translateY(-8px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .suggestions-header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px 6px;
      font-size: 0.68rem;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 16px;
      cursor: pointer;
      transition: background 0.15s;
      border-bottom: 1px solid rgba(255,255,255,0.03);
    }
    .suggestion-item:last-child { border-bottom: none; }
    .suggestion-item:hover, .suggestion-item.highlighted {
      background: rgba(59,130,246,0.12);
    }
    .flag { font-size: 1.2rem; flex-shrink: 0; line-height: 1; }
    .suggest-text {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }
    .city-name {
      font-weight: 700;
      font-size: 0.9rem;
      color: #f1f5f9;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .city-sub {
      font-size: 0.75rem;
      color: #64748b;
    }
    .suggest-coords {
      font-size: 0.68rem;
      color: #334155;
      font-family: monospace;
      flex-shrink: 0;
    }
    .no-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 28px 16px;
      color: #475569;
      font-size: 0.875rem;
      text-align: center;
    }
  `]
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  suggestions: CitySuggestion[] = [];
  showDropdown = false;
  isFocused = false;
  isLoadingSuggestions = false;
  hasSearched = false;
  activeIndex = -1;

  private searchSubject = new Subject<string>();
  private sub: Subscription | null = null;
  private suggestSub: Subscription | null = null;

  @Input() set query(val: string) {
    if (val) this.searchControl.setValue(val, { emitEvent: false });
  }

  @Output() search = new EventEmitter<string>();
  @Output() searchByCoords = new EventEmitter<{ lat: number; lon: number; name: string }>();
  @Output() requestLocation = new EventEmitter<void>();

  constructor(private weatherService: WeatherService, private elRef: ElementRef) {}

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    if (!this.elRef.nativeElement.contains(e.target)) {
      this.closeSuggestions();
    }
  }

  ngOnInit() {
    // RxJS Stream Architecture: debounceTime + switchMap for clean concurrent request cancellation
    this.suggestSub = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(val => val.trim().length >= 2)
    ).subscribe(query => {
      this.isLoadingSuggestions = true;
      this.hasSearched = false;
      this.weatherService.getCitySuggestions(query).subscribe({
        next: (results) => {
          this.suggestions = results;
          this.showDropdown = true;
          this.isLoadingSuggestions = false;
          this.hasSearched = true;
          this.activeIndex = -1;
        },
        error: () => {
          this.suggestions = [];
          this.isLoadingSuggestions = false;
          this.hasSearched = true;
        }
      });
    });

    this.searchControl.valueChanges.subscribe(val => {
      if (val === null || val.trim().length === 0) {
        this.closeSuggestions();
        this.isLoadingSuggestions = false;
      } else if (val.trim().length >= 2) {
        this.isLoadingSuggestions = true;
        this.searchSubject.next(val);
      }
    });
  }

  onFocus() {
    this.isFocused = true;
    const val = this.searchControl.value;
    if (val && val.trim().length >= 2 && this.suggestions.length > 0) {
      this.showDropdown = true;
    }
  }

  onBlur() {
    this.isFocused = false;
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.showDropdown || this.suggestions.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = Math.min(this.activeIndex + 1, this.suggestions.length - 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, -1);
    }
  }

  onEnter() {
    if (this.activeIndex >= 0 && this.suggestions[this.activeIndex]) {
      this.selectSuggestion(this.suggestions[this.activeIndex]);
    } else {
      const val = this.searchControl.value;
      if (val && val.trim().length > 0) {
        this.closeSuggestions();
        this.search.emit(val.trim());
      }
    }
  }

  selectSuggestion(s: CitySuggestion) {
    this.searchControl.setValue(s.displayName, { emitEvent: false });
    this.closeSuggestions();
    this.searchByCoords.emit({ lat: s.lat, lon: s.lon, name: s.name });
  }

  onLocationClick() {
    this.closeSuggestions();
    this.requestLocation.emit();
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.closeSuggestions();
  }

  closeSuggestions() {
    this.showDropdown = false;
    this.suggestions = [];
    this.activeIndex = -1;
  }

  /** Convert ISO country code to flag emoji */
  getFlagEmoji(countryCode: string): string {
    if (!countryCode || countryCode.length !== 2) return '🌍';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(c => 127397 + c.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.suggestSub?.unsubscribe();
  }
}
