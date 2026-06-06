import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  city: string;
  country: string;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
}

export interface ForecastDay {
  date: Date;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  icon: string;
  description: string;
}

export interface DayAverage {
  date: Date;
  avgTemp: number;
}

export interface CitySuggestion {
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  displayName: string;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiUrl = environment.openWeatherApiUrl;
  private geoUrl = 'https://api.openweathermap.org/geo/1.0';
  private apiKey = environment.openWeatherApiKey;

  constructor(private http: HttpClient) {}

  /** Geocoding API: returns up to 8 city suggestions for autocomplete */
  getCitySuggestions(query: string): Observable<CitySuggestion[]> {
    if (!query || query.trim().length < 2 || this.apiKey === 'TODO_YOUR_API_KEY_HERE') {
      return of([]);
    }
    const url = `${this.geoUrl}/direct?q=${encodeURIComponent(query)}&limit=8&appid=${this.apiKey}`;
    return this.http.get<any[]>(url).pipe(
      map(results => results.map(r => ({
        name: r.name,
        state: r.state || '',
        country: r.country || '',
        lat: r.lat,
        lon: r.lon,
        displayName: r.state
          ? `${r.name}, ${r.state}, ${r.country}`
          : `${r.name}, ${r.country}`
      }))),
      catchError(() => of([]))
    );
  }

  getCurrentWeather(city: string): Observable<WeatherData> {
    if (this.apiKey === 'TODO_YOUR_API_KEY_HERE') {
      return throwError(() => new Error('API Key missing'));
    }
    const url = `${this.apiUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get<any>(url).pipe(
      delay(500),
      map(res => this.mapWeather(res)),
      catchError(this.handleError)
    );
  }

  getCurrentWeatherByCoords(lat: number, lon: number): Observable<WeatherData> {
    if (this.apiKey === 'TODO_YOUR_API_KEY_HERE') {
      return throwError(() => new Error('API Key missing'));
    }
    const url = `${this.apiUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get<any>(url).pipe(
      delay(500),
      map(res => this.mapWeather(res)),
      catchError(this.handleError)
    );
  }

  getForecast(city: string): Observable<ForecastDay[]> {
    if (this.apiKey === 'TODO_YOUR_API_KEY_HERE') {
      return throwError(() => new Error('API Key missing'));
    }
    const url = `${this.apiUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get<any>(url).pipe(
      map(res => this.processForecast(res.list)),
      catchError(this.handleError)
    );
  }

  getForecastByCoords(lat: number, lon: number): Observable<ForecastDay[]> {
    if (this.apiKey === 'TODO_YOUR_API_KEY_HERE') {
      return throwError(() => new Error('API Key missing'));
    }
    const url = `${this.apiUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get<any>(url).pipe(
      map(res => this.processForecast(res.list)),
      catchError(this.handleError)
    );
  }

  /** Compute mathematical averages for the upcoming 4 days (excluding today) */
  getAverages(forecast: ForecastDay[]): DayAverage[] {
    const today = new Date().toDateString();
    const upcoming = forecast.filter(f => f.date.toDateString() !== today);
    return upcoming.slice(0, 4).map(f => ({
      date: f.date,
      avgTemp: f.avgTemp
    }));
  }

  private mapWeather(res: any): WeatherData {
    return {
      temp: res.main.temp,
      feelsLike: res.main.feels_like,
      humidity: res.main.humidity,
      windSpeed: res.wind.speed,
      city: res.name,
      country: res.sys.country,
      description: res.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`,
      sunrise: res.sys.sunrise,
      sunset: res.sys.sunset
    };
  }

  private processForecast(list: any[]): ForecastDay[] {
    const dailyData = new Map<string, { temps: number[], minTemps: number[], maxTemps: number[], icon: string, description: string }>();

    list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];

      if (!dailyData.has(dayKey)) {
        dailyData.set(dayKey, {
          temps: [],
          minTemps: [],
          maxTemps: [],
          icon: item.weather[0].icon.replace('n', 'd'),
          description: item.weather[0].description
        });
      }
      const d = dailyData.get(dayKey)!;
      d.temps.push(item.main.temp);
      d.minTemps.push(item.main.temp_min);
      d.maxTemps.push(item.main.temp_max);
      // Prefer midday icon (12:00)
      if (item.dt_txt && item.dt_txt.includes('12:00')) {
        d.icon = item.weather[0].icon.replace('n', 'd');
        d.description = item.weather[0].description;
      }
    });

    const forecast: ForecastDay[] = [];
    dailyData.forEach((value, key) => {
      const avg = value.temps.reduce((a, b) => a + b, 0) / value.temps.length;
      const min = Math.min(...value.minTemps);
      const max = Math.max(...value.maxTemps);
      forecast.push({
        date: new Date(key),
        avgTemp: Math.round(avg * 10) / 10,
        minTemp: Math.round(min * 10) / 10,
        maxTemp: Math.round(max * 10) / 10,
        icon: `https://openweathermap.org/img/wn/${value.icon}@2x.png`,
        description: value.description
      });
    });

    // Return up to 7 days (today + 6 more)
    return forecast.slice(0, 7);
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'Failed to fetch weather data. Please try again.';
    if (error.status === 404) msg = 'City not found. Please check the city name.';
    if (error.status === 401) msg = 'Invalid API key. Please check configuration.';
    return throwError(() => new Error(msg));
  }
}
