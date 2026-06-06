import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService, ForecastDay } from './weather';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  // Mock 3-hourly forecast list for 3 days (6 entries each day = 18 total)
  const buildForecastItem = (dayOffset: number, hour: number, temp: number) => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, 0, 0, 0);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dt_txt = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(hour)}:00:00`;
    return {
      dt: Math.floor(d.getTime() / 1000),
      dt_txt,
      main: { temp, temp_min: temp - 2, temp_max: temp + 2 },
      weather: [{ icon: '01d', description: 'clear sky' }]
    };
  };

  const mockForecastList = [
    buildForecastItem(0, 6, 22),
    buildForecastItem(0, 12, 28),
    buildForecastItem(0, 18, 25),
    buildForecastItem(1, 6, 20),
    buildForecastItem(1, 12, 26),
    buildForecastItem(1, 18, 23),
    buildForecastItem(2, 6, 18),
    buildForecastItem(2, 12, 24),
    buildForecastItem(2, 18, 21),
    buildForecastItem(3, 6, 19),
    buildForecastItem(3, 12, 25),
    buildForecastItem(3, 18, 22),
    buildForecastItem(4, 6, 17),
    buildForecastItem(4, 12, 23),
    buildForecastItem(4, 18, 20),
    buildForecastItem(5, 6, 16),
    buildForecastItem(5, 12, 22),
    buildForecastItem(5, 18, 19),
    buildForecastItem(6, 6, 15),
    buildForecastItem(6, 12, 21),
    buildForecastItem(6, 18, 18),
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('processForecast returns at most 7 days', () => {
    // Access private method via casting
    const result: ForecastDay[] = (service as any).processForecast(mockForecastList);
    expect(result.length).toBeLessThanOrEqual(7);
    expect(result.length).toBeGreaterThan(0);
  });

  it('processForecast calculates correct avgTemp', () => {
    const result: ForecastDay[] = (service as any).processForecast(mockForecastList);
    const today = result[0];
    // Today: temps are 22, 28, 25 => avg = 25.0
    expect(today.avgTemp).toBeCloseTo(25.0, 0);
  });

  it('processForecast sets minTemp and maxTemp', () => {
    const result: ForecastDay[] = (service as any).processForecast(mockForecastList);
    expect(result[0].minTemp).toBeDefined();
    expect(result[0].maxTemp).toBeDefined();
    expect(result[0].maxTemp).toBeGreaterThan(result[0].minTemp);
  });

  it('getAverages returns 4 upcoming days (excluding today)', () => {
    const forecast: ForecastDay[] = (service as any).processForecast(mockForecastList);
    const avgs = service.getAverages(forecast);
    expect(avgs.length).toBe(4);
    const todayStr = new Date().toDateString();
    avgs.forEach(a => {
      expect(a.date.toDateString()).not.toBe(todayStr);
    });
  });

  it('handleError maps 404 to city-not-found message', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };
    let errorMsg = '';

    service.getCurrentWeather('FakeCity404XYZ').subscribe({
      error: (err) => { errorMsg = err.message; }
    });

    const req = httpMock.expectOne(r => r.url.includes('/weather'));
    req.flush('Not Found', errorResponse);

    expect(errorMsg).toContain('City not found');
  });
});
