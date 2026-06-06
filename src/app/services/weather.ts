import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

export interface WeatherData {
  temp: number;
  city: string;
  description: string;
  icon: string;
}

export interface ForecastDay {
  date: Date;
  avgTemp: number;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = environment.openWeatherApiUrl;
  private apiKey = environment.openWeatherApiKey;

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<WeatherData> {
    if (this.apiKey === 'TODO_YOUR_API_KEY_HERE') {
      return throwError(() => new Error('API Key missing'));
    }
    const url = `${this.apiUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get<any>(url).pipe(
      delay(600), // small delay to ensure loading state is visible
      map(res => ({
        temp: res.main.temp,
        city: res.name,
        description: res.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`
      })),
      catchError(this.handleError)
    );
  }

  getCurrentWeatherByCoords(lat: number, lon: number): Observable<WeatherData> {
    if (this.apiKey === 'TODO_YOUR_API_KEY_HERE') {
      return throwError(() => new Error('API Key missing'));
    }
    const url = `${this.apiUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get<any>(url).pipe(
      delay(600),
      map(res => ({
        temp: res.main.temp,
        city: res.name,
        description: res.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`
      })),
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

  private processForecast(list: any[]): ForecastDay[] {
    const dailyData = new Map<string, { temps: number[], icon: string }>();

    list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];
      
      if (!dailyData.has(dayKey)) {
        // Find midday icon if possible or just use first one
        dailyData.set(dayKey, { temps: [], icon: item.weather[0].icon.replace('n', 'd') }); 
      }
      dailyData.get(dayKey)!.temps.push(item.main.temp);
    });

    const forecast: ForecastDay[] = [];
    dailyData.forEach((value, key) => {
      const avg = value.temps.reduce((a, b) => a + b, 0) / value.temps.length;
      forecast.push({
        date: new Date(key),
        avgTemp: Math.round(avg * 10) / 10,
        icon: `https://openweathermap.org/img/wn/${value.icon}@2x.png`
      });
    });

    return forecast.slice(0, 5); // Return up to 5 days
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Failed to fetch weather data. Please try again.'));
  }
}
